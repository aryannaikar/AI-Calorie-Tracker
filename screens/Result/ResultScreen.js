// screens/Result/ResultScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { detectFood } from "../../services/visionService";
import { getNutritionFromGemini } from "../../services/geminiService";

export default function ResultScreen({ route }) {
  const { imageUri, base64 } = route.params;

  const [nutrition, setNutrition] = useState(null);
  const [status, setStatus] = useState("Detecting food...");
  const [error, setError] = useState(null);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      // Step 1: Vision
      const foodName = await detectFood(base64);
      console.log("Detected:", foodName);

      setStatus("Estimating nutrition...");

      // Step 2: Gemini
      const nutritionData = await getNutritionFromGemini(foodName);
      console.log("Gemini:", nutritionData);

      if (!nutritionData) {
        setError("Failed to estimate nutrition.");
        return;
      }

      setNutrition(nutritionData);
    } catch (err) {
      console.log("AI Error:", err);
      setError("Something went wrong.");
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!nutrition) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.status}>{status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <Text style={styles.title}>{nutrition.food}</Text>

      <Text>Calories: {nutrition.calories} kcal</Text>
      <Text>Protein: {nutrition.protein} g</Text>
      <Text>Carbs: {nutrition.carbs} g</Text>
      <Text>Fat: {nutrition.fat} g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    borderRadius: 10
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  status: {
    marginTop: 15,
    fontSize: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  }
});