
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use the process.env.API_KEY directly in the named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyReflection = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma reflexão curta e inspiradora (máximo 280 caracteres) para um jovem católico do movimento EJC, focada no serviço e no encontro com Cristo.",
      config: {
        temperature: 0.7,
      },
    });
    // Fix: Access the text property directly (it's not a method).
    return response.text || "O Cristo que nos une é o mesmo que nos envia. Seja luz no mundo!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tudo posso naquele que me fortalece. (Filipenses 4:13)";
  }
};

export const generateQuizQuestion = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma pergunta de múltipla escolha sobre a Bíblia ou a Igreja Católica, adequada para jovens.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    });
    // Fix: Access the text property directly and handle potential undefined value before parsing.
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};
