// screens/ProfileSetup/ProfileSetupScreen.js

import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";

export default function ProfileSetupScreen({ navigation }) {
  const { user, profileExists, setProfileExists } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");

  // 🔥 Improved Accurate Calculation
  const calculateGoals = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) return null;

    // ✅ BMI
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);

    // ✅ BMR (Mifflin-St Jeor Formula)
    let bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    // ✅ Activity Multipliers
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725
    };

    const multiplier = activityMap[activity] || 1.55;

    // ✅ TDEE (Maintenance Calories)
    const maintenanceCalories = bmr * multiplier;

    // ✅ Goal Adjustment
    let finalCalories = maintenanceCalories;

    if (goal === "loss") finalCalories -= 500;
    if (goal === "gain") finalCalories += 300;

    // Safety minimum
    if (finalCalories < 1200) finalCalories = 1200;

    // ✅ Protein Goals (as per spec)
    let proteinGoal = 0;

    if (goal === "loss") proteinGoal = w * 1.6;
    if (goal === "maintain") proteinGoal = w * 1.2;
    if (goal === "gain") proteinGoal = w * 2.0;

    return {
      bmi: Number(bmi.toFixed(1)),
      bmr: Math.round(bmr),
      tdee: Math.round(maintenanceCalories),
      calorieGoal: Math.round(finalCalories),
      proteinGoal: Math.round(proteinGoal)
    };
  };

  const handleSave = async () => {
    if (!name || !age || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    const goals = calculateGoals();
    if (!goals) return;

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
        activityLevel: activity,
        goal,
        bmi: goals.bmi,
        bmr: goals.bmr,
        tdee: goals.tdee,
        calorieGoal: goals.calorieGoal,
        proteinGoal: goals.proteinGoal,
        createdAt: new Date()
      });

      alert(
        `Profile Saved!

BMI: ${goals.bmi}
BMR: ${goals.bmr} kcal
Maintenance: ${goals.tdee} kcal
Target Calories: ${goals.calorieGoal} kcal
Protein Target: ${goals.proteinGoal} g`
      );

      if (profileExists) {
        navigation.goBack();
      } else {
        setProfileExists(true);
      }
    } catch (error) {
      console.log(error);
      alert("Error saving profile");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        style={styles.input}
        value={age}
        onChangeText={setAge}
      />

      <TextInput
        placeholder="Height (cm)"
        keyboardType="numeric"
        style={styles.input}
        value={height}
        onChangeText={setHeight}
      />

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, gender === "male" && styles.selected]}
          onPress={() => setGender("male")}
        >
          <Text>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, gender === "female" && styles.selected]}
          onPress={() => setGender("female")}
        >
          <Text>Female</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.row}>
        {["sedentary", "light", "moderate", "heavy"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.option,
              activity === level && styles.selected
            ]}
            onPress={() => setActivity(level)}
          >
            <Text>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Goal</Text>
      <View style={styles.row}>
        {["loss", "maintain", "gain"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, goal === g && styles.selected]}
            onPress={() => setGoal(g)}
          >
            <Text>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10
  },
  selected: {
    backgroundColor: "#C8E6C9",
    borderColor: "#4CAF50"
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});