const GEMINI_API_KEY = "AIzaSyDNEhSbZKQg3k7tvnnquvEPBZcWCFoIp8o";

export const getNutritionFromText = async (foodName, quantity) => {
  try {
    const prompt = `
You are a certified nutritionist AI.

Your task is to estimate realistic Indian meal nutrition.

Food Dish: ${foodName}
User Quantity: ${quantity}

CRITICAL RULE:
If the quantity mentions grams of a protein source (paneer, chicken, egg, fish, tofu, soya chunks, meat),
ASSUME the grams refer to the MAIN PROTEIN INGREDIENT inside the dish,
not the total curry/gravy weight.

Example:
"paneer masala 100g" = curry containing 100g paneer cubes
"chicken curry 200g" = curry containing 200g cooked chicken pieces

Also assume typical Indian home-style cooking using normal oil and masala.

Return STRICT JSON ONLY:

{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}

Rules:
- No markdown
- No explanation
- No text before or after JSON
- Numbers only
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("TEXT GEMINI RESPONSE:", data);

    if (!data.candidates) {
      console.log("Gemini Error Response:", data);
      return null;
    }

    let text = data.candidates[0].content.parts[0].text;

    // Remove ```json formatting if present
    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.log("Nutrition Gemini Error:", error);
    return null;
  }
};