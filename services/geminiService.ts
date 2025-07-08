import { GoogleGenAI } from "@google/genai";

// Initialize AI conditionally to avoid crashing if the key isn't set.
// The app will function, but AI features will show an error.
export const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const model = 'gemini-2.5-flash-preview-04-17';

export interface ProductInfo {
    brand?: string;
    model?: string;
}

export interface AiResponse {
    objectName: string;
    description: string;
    translatedDescription: string;
    otherObjects?: {
        name: string;
        description: string;
    }[];
    detectedText?: {
        original: string;
        translated: string;
    };
    isCommercial?: boolean;
    productInfo?: ProductInfo | null;
    searchQuery?: string;
    ambient?: {
        lighting: string;
        temperature: string;
    };
}

export const analyzeImageAndText = async (
  base64Image,
  prompt
): Promise<string | AiResponse> => {
  if (!ai) {
    console.error("Gemini API key not configured. Cannot analyze image.");
    return "Error from AI: API key is not configured.";
  }
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    
    const responseText = response.text;

    // The identify prompt now asks for JSON. We check for a keyword from that prompt.
    const isJsonPrompt = typeof prompt === 'string' && prompt.includes('"objectName"');
    
    if (isJsonPrompt) {
        let jsonStr = responseText.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        try {
          const parsedData = JSON.parse(jsonStr) as AiResponse;
          // Basic validation
          if (parsedData.objectName && parsedData.description && parsedData.translatedDescription) {
            return parsedData;
          } else {
             throw new Error("Parsed JSON is missing required keys.");
          }
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          // Fallback to text if JSON parsing fails
          return `I see the following: ${responseText}`;
        }
    }

    return responseText;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    if (error instanceof Error) {
        return `Error from AI: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI.";
  }
};