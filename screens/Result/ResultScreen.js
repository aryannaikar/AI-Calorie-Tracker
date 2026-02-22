// screens/Result/ResultScreen.js

import { addDoc, collection } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import { getNutritionFromImage } from "../../services/geminiService";

export default function ResultScreen({ route, navigation }) {
  const { imageUri, base64 } = route.params;
  const { user } = useContext(AuthContext);

  const [nutrition, setNutrition] = useState(null);
  const [status, setStatus] = useState("Analyzing food image...");
  const [error, setError] = useState(null);

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      // Send image directly to Gemini Vision
      const nutritionData = await getNutritionFromImage(base64);
      console.log("Gemini:", nutritionData);

      if (!nutritionData) {
        setError("Failed to analyze food. Please try again.");
        return;
      }

      setNutrition(nutritionData);
    } catch (err) {
      console.log("AI Error:", err);
      setError("Something went wrong.");
    }
  };

  const handleAddToDashboard = async () => {
    try {
      const total = nutrition.total;
      const itemNames = nutrition.items.map((i) => i.name).join(", ");

      await addDoc(collection(db, "meals"), {
        uid: user.uid,
        date: todayDate,
        mealType: "scanned",
        foodName: itemNames,
        quantity: "scanned",
        calories: total.calories,
        protein: total.protein,
        carbs: total.carbs,
        fat: total.fat,
        createdAt: new Date()
      });

      Alert.alert("Added!", "Meal added to your dashboard.", [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") }
      ]);
    } catch (err) {
      console.log("Add Error:", err);
      Alert.alert("Error", "Could not add meal.");
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <Text style={styles.title}>Detected Items</Text>

      {nutrition.items.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetail}>~{item.estimated_grams}g</Text>
          <Text style={styles.itemDetail}>{item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g</Text>
        </View>
      ))}

      <View style={styles.totalCard}>
        <Text style={styles.totalTitle}>Total</Text>
        <Text style={styles.totalText}>{nutrition.total.calories} kcal</Text>
        <Text style={styles.totalText}>
          Protein: {nutrition.total.protein}g  |  Carbs: {nutrition.total.carbs}g  |  Fat: {nutrition.total.fat}g
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToDashboard}>
        <Text style={styles.addButtonText}>➕ Add to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },
  image: {
    width: "100%",
    height: 220,
    marginBottom: 20,
    borderRadius: 12
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12
  },
  itemCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4
  },
  itemDetail: {
    color: "#555",
    fontSize: 13
  },
  totalCard: {
    backgroundColor: "#e8f5e9",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center"
  },
  totalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4
  },
  totalText: {
    fontSize: 15,
    color: "#2e7d32"
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});