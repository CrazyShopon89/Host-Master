
import { GoogleGenAI } from "@google/genai";
import { HostingRecord, AppSettings } from "../types";

// Strictly fetch from environment. No hardcoded keys allowed.
const getApiKey = () => {
  return typeof process !== 'undefined' && process.env.API_KEY ? process.env.API_KEY : null;
};

export const analyzeHostingData = async (
  query: string,
  data: HostingRecord[]
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return "AI Features Disabled: No API Key found in server environment variables. Please configure your API_KEY in cPanel.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    You are an intelligent assistant for HostMaster.
    Context:
    - Current Records: ${JSON.stringify(data.slice(0, 50))} 
    - Current Date: ${new Date().toISOString().split('T')[0]}

    User Query: ${query}

    Instructions: Analyze data accurately. Use financial amounts. Identify renewals. Concise markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI service is currently unavailable. Check your API key and quota.";
  }
};

export const draftInvoiceEmail = async (
  record: HostingRecord,
  settings: AppSettings
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `Subject: Invoice ${record.invoiceNumber || 'Draft'} - ${record.website}

Dear ${record.clientName},

Your hosting renewal for ${record.website} is due on ${record.validationDate}. 
Total: ${settings.currency}${record.amount.toFixed(2)}.

Regards,
${settings.companyName}`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Draft a professional hosting renewal email.
    Client: ${record.clientName} | Site: ${record.website} | Due: ${record.validationDate} | Total: ${settings.currency}${record.amount.toFixed(2)}
    Company: ${settings.companyName}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate email.";
  } catch (error) {
    return "Error generating AI draft. Using standard template.";
  }
};
