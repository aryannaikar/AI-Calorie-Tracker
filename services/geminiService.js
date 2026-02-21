import { GEMINI_API_KEY } from "@env";

export const getNutritionFromGemini = async (foodName) => {
    try {
       const prompt = `
You are a food recognition and nutrition expert.

Look at the food image carefully.

1. Identify ALL visible food items separately.
2. Estimate portion size in grams for each item.
3. Estimate calories, protein, carbs, and fat for each item.
4. Then calculate total calories and macros.
5. Respond ONLY in this JSON format:

{
  "items": [
    {
      "name": "food name",
      "estimated_grams": number,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "total": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Do not write explanations.
Return only valid JSON.
`;;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();
        console.log("GEMINI RESPONSE:", data);

        if (!data.candidates) {
            console.log("Gemini Error Response:", data);
            return null;
        }

        let text = data.candidates[0].content.parts[0].text;

        // remove ```json ```
        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);

    } catch (error) {
        console.log("Gemini Error:", error);
        return null;
    }
};