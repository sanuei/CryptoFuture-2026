import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the API client
// Note: process.env.API_KEY is expected to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a chat session context-aware of the specific script.
 * Returns a generator that streams the response.
 */
export const createScriptAnalysisChat = (scriptContent: string) => {
  const systemInstruction = `
    You are an AI Analyst for the YouTube channel 'CryptoFuture 2026'.
    You have access to the following video script.
    Your persona is: Cyberpunk, analytical, slightly edgy, concise, and very knowledgeable about crypto.
    Always answer questions based on the provided script content primarily, but you can use your general knowledge to fill gaps.
    
    SCRIPT CONTENT:
    """
    ${scriptContent}
    """
  `;

  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });

  return chat;
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return await chat.sendMessageStream({ message });
};
