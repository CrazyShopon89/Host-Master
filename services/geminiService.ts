import { GoogleGenAI } from "@google/genai";
import { HostingRecord } from "../types";

export const analyzeHostingData = async (
  query: string,
  data: HostingRecord[]
): Promise<string> => {
  // Safe check for API key to prevent browser crashes
  const apiKey = typeof process !== 'undefined' && process.env.API_KEY ? process.env.API_KEY : null;

  if (!apiKey) {
    return "AI Assistant is currently in demo mode (No API Key detected). Please configure an API key to enable data analysis.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    You are an intelligent assistant for HostMaster, a Hosting Management Software.
    Context:
    - Current Records: ${JSON.stringify(data.slice(0, 50))} 
    - Current Date: ${new Date().toISOString().split('T')[0]}

    User Query: ${query}

    Instructions:
    1. Analyze the provided hosting data to answer accurately.
    2. If asked for financial summaries, calculate using the 'amount' field.
    3. If asked for renewal help, identify clients with upcoming 'validationDate'.
    4. Provide professional, concise markdown responses.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the AI service. The rest of the app is working fine!";
  }
};