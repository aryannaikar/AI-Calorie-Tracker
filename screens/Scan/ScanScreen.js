import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getNutritionFromGemini } from "../../services/geminiService";

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Picked Image:", uri);
      setImageUri(uri);
      analyzeImage(uri);
    }
  };

  const analyzeImage = async (uri) => {
    try {
      setLoading(true);
      const data = await getNutritionFromGemini(uri);
      console.log("Gemini Result:", data);
      setNutrition(data);
    } catch (error) {
      console.log("Scan Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Pick Food Image" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {loading && <ActivityIndicator size="large" />}

      {nutrition && (
        <View style={styles.result}>
          <Text style={styles.title}>Detected Items:</Text>

          {nutrition.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>{item.calories} kcal</Text>
              <Text>Protein: {item.protein} g</Text>
              <Text>Carbs: {item.carbs} g</Text>
              <Text>Fat: {item.fat} g</Text>
            </View>
          ))}

          <Text style={styles.total}>
            Total Calories: {nutrition.total.calories} kcal
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
  result: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  itemName: {
    fontWeight: "bold",
  },
  total: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});