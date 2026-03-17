const GOOGLE_VISION_API_KEY = "AIzaSyB3cwzDILoRFbWEvz1j_jLNXm3olTJtaXI";

export const detectFood = async (base64Image) => {
  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: "LABEL_DETECTION", maxResults: 10 }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const labels = data.responses[0].labelAnnotations;

    if (!labels || labels.length === 0) {
      return "Indian food";
    }

    const ignoreWords = [
      "food",
      "dish",
      "cuisine",
      "ingredient",
      "plate",
      "tableware",
      "dishware",
      "table",
      "meal"
    ];

    for (let label of labels) {
      const word = label.description.toLowerCase();
      if (!ignoreWords.includes(word)) {
        return label.description;
      }
    }

    return "Indian food";
  } catch (error) {
    console.log("Vision Error:", error);
    return "Indian food";
  }
};