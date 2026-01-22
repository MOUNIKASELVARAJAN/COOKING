
import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, HeatLevel, CookingResult } from './types';

export async function judgeDish(
  ingredients: Ingredient[],
  time: number,
  heat: HeatLevel
): Promise<CookingResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const ingredientNames = ingredients.map(i => i.name).join(", ");
  const prompt = `
    A user cooked a dish in a game.
    Ingredients used: ${ingredientNames}
    Cooking Time: ${time} seconds
    Heat Intensity: ${heat}
    
    If the time is < 3s, it's RAW.
    If the time is > 10s and heat is high, it's BURNT.
    If the ingredients are weird (e.g. Steak and Chocolate), make a funny comment.
    
    Respond in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            critique: { type: Type.STRING },
            score: { type: Type.NUMBER },
            rating: { type: Type.STRING, description: "One word rating like 'Delicious', 'Abomination', 'Average'" },
          },
          required: ["dishName", "critique", "score", "rating"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      dishName: "The Mystery Platter",
      critique: "The stove glitched out, but it smells like... something.",
      score: 5,
      rating: "Mysterious"
    };
  }
}
