import { GoogleGenAI } from "@google/genai";
import { HostingRecord } from "../types";

// We initialize the client only when needed to ensure the key is present
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeHostingData = async (
  query: string,
  data: HostingRecord[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Please configure your Gemini API Key to use the AI Assistant.";

  const context = `
    You are an intelligent assistant for a Hosting Management Software.
    You have access to the following hosting records (in JSON format):
    ${JSON.stringify(data.slice(0, 50))} 
    (Note: Only the first 50 records are provided for brevity if the list is long).

    Current Date: ${new Date().toISOString().split('T')[0]}

    User Query: ${query}

    Instructions:
    1. Analyze the data to answer the user's question.
    2. If asked to draft an email, provide a professional email template based on the client's data.
    3. If asked for financial insights, calculate totals from the 'amount' field.
    4. Keep responses concise and helpful.
    5. Format lists using markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};
