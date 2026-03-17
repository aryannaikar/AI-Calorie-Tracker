const GEMINI_API_KEY = "AIzaSyDNEhSbZKQg3k7tvnnquvEPBZcWCFoIp8o";

// Send image directly to Gemini Vision — no Vision API needed
export const getNutritionFromImage = async (base64Image) => {
    try {
        const prompt = `You are an expert food nutritionist specializing in Indian cuisine.

CAREFULLY look at the food image provided.

RULES:
- Identify ONLY the food items you can ACTUALLY SEE in the image. Do NOT guess or hallucinate.
- Be SPECIFIC with Indian dishes: e.g. "Chapati", "Roti", "Paneer Butter Masala", "Dal Tadka", "Rice", "Sambar", "Idli" etc.
- Do NOT confuse similar-looking foods (e.g. chapati is NOT rice, paneer curry is NOT chicken curry).
- If you see flatbread, call it Chapati or Roti, NOT bread or rice.
- If you see paneer (white cubed cottage cheese) in gravy, call it by the specific curry name.
- Estimate realistic Indian home-style portion sizes.

For each food item you SEE, estimate:
1. Name (specific Indian dish name)
2. Portion size in grams
3. Calories, Protein, Carbs, Fat

Return ONLY valid JSON, no explanation, no markdown:

{
  "items": [
    {
      "name": "exact food name",
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
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt },
                                {
                                    inline_data: {
                                        mime_type: "image/jpeg",
                                        data: base64Image
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log("Gemini Vision Response:", data);

        if (!data.candidates) {
            console.log("Gemini Error:", data);
            return null;
        }

        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, "").trim();
        return JSON.parse(text);

    } catch (error) {
        console.log("Gemini Vision Error:", error);
        return null;
    }
};

// Keep old text-based function for nutritionService compatibility
export const getNutritionFromGemini = async (foodName) => {
    try {
        const prompt = `You are a food recognition and nutrition expert.

Food: ${foodName}

Estimate nutrition. Return ONLY this JSON:

{
  "items": [
    {
      "name": "${foodName}",
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
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        if (!data.candidates) return null;

        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, "").trim();
        return JSON.parse(text);

    } catch (error) {
        console.log("Gemini Error:", error);
        return null;
    }
};
