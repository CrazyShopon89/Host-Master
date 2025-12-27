
import { GoogleGenAI } from "@google/genai";
import { HostingRecord } from "../types";

export const analyzeHostingData = async (
  query: string,
  data: HostingRecord[]
): Promise<string> => {
  // Always initialize with the environment variable as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    return "I'm having trouble connecting to my brain. Please check your connection or try again later.";
  }
};
