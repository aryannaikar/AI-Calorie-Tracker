import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../firebaseConfig";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where
} from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getNutritionFromText } from "../../services/nutritionService";
import styles from "./DashboardStyles";

export default function DashboardScreen({ navigation }) {

    const { user, logout } = useContext(AuthContext);

    const [profileImage, setProfileImage] = useState(null);
    const [calorieGoal, setCalorieGoal] = useState(0);
    const [proteinGoal, setProteinGoal] = useState(0);

    const [meals, setMeals] = useState([]);
    const [weeklyData, setWeeklyData] = useState({});

    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);

    const [editingGoal, setEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState("");

    const todayDate = new Date().toISOString().split("T")[0];

    // ================= FETCH USER =================
    useEffect(() => {
        if (!user) return;

        const fetchUser = async () => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setCalorieGoal(data.calorieGoal || 0);
                setProteinGoal(data.proteinGoal || 0);
                setProfileImage(data.profileImage || null);
            }
        };

        fetchUser();
    }, [user]);

    // ================= TODAY MEALS LISTENER =================
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "meals"),
            where("uid", "==", user.uid),
            where("date", "==", todayDate)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mealList = [];
            snapshot.forEach((doc) => {
                mealList.push({ id: doc.id, ...doc.data() });
            });
            setMeals(mealList);
        });

        return () => unsubscribe();
    }, [user]);

    // ================= WEEKLY ANALYTICS =================
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "meals"), where("uid", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const grouped = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (!grouped[data.date]) grouped[data.date] = 0;
                grouped[data.date] += data.calories || 0;
            });
            setWeeklyData(grouped);
        });

        return () => unsubscribe();
    }, [user]);

    // ================= PROFILE IMAGE UPLOAD =================
    const handleProfileUpload = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert("Permission required to access gallery");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                quality: 0.7
            });

            if (result.canceled) return;

            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();

            const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            await updateDoc(doc(db, "users", user.uid), {
                profileImage: downloadURL
            });

            setProfileImage(downloadURL);

            Alert.alert("Profile Updated!");
        } catch (error) {
            console.log("Profile Upload Error:", error);
        }
    };

    // ================= ADD MEAL =================
    const handleAddMeal = async () => {
        if (!foodName || !quantity) return;

        try {
            setLoading(true);

            const nutrition = await getNutritionFromText(foodName, quantity);
            if (!nutrition) return;

            await addDoc(collection(db, "meals"), {
                uid: user.uid,
                date: todayDate,
                mealType: selectedMeal,
                foodName,
                quantity,
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat,
                createdAt: new Date()
            });

            setFoodName("");
            setQuantity("");
        } catch (error) {
            console.log("Add Meal Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= SAVE CALORIE GOAL =================
    const handleSaveGoal = async () => {
        const parsed = parseInt(goalInput);
        if (isNaN(parsed) || parsed <= 0) {
            Alert.alert("Invalid", "Please enter a valid calorie goal.");
            return;
        }
        try {
            await updateDoc(doc(db, "users", user.uid), { calorieGoal: parsed });
            setCalorieGoal(parsed);
            setEditingGoal(false);
            setGoalInput("");
        } catch (error) {
            console.log("Save Goal Error:", error);
            Alert.alert("Error", "Could not save goal.");
        }
    };

    // ================= DELETE MEAL =================
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "meals", id));
    };

    // ================= RESET TODAY'S DATA =================
    const handleResetData = () => {
        Alert.alert(
            "Reset Today's Data",
            "This will delete all meals logged today. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const deletePromises = meals.map((meal) =>
                                deleteDoc(doc(db, "meals", meal.id))
                            );
                            await Promise.all(deletePromises);
                            Alert.alert("Done", "Today's data has been reset.");
                        } catch (error) {
                            console.log("Reset Error:", error);
                            Alert.alert("Error", "Failed to reset data.");
                        }
                    }
                }
            ]
        );
    };

    // ================= CALCULATIONS =================
    const calculateTotals = (type) => {
        return meals
            .filter((meal) => meal.mealType === type)
            .reduce(
                (acc, meal) => {
                    acc.calories += meal.calories || 0;
                    acc.protein += meal.protein || 0;
                    acc.carbs += meal.carbs || 0;
                    acc.fat += meal.fat || 0;
                    return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );
    };

    const breakfast = calculateTotals("breakfast");
    const lunch = calculateTotals("lunch");
    const dinner = calculateTotals("dinner");

    const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);
    const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
    const totalCarbs = meals.reduce((s, m) => s + (m.carbs || 0), 0);
    const totalFat = meals.reduce((s, m) => s + (m.fat || 0), 0);

    const progress =
        calorieGoal > 0
            ? Math.min((totalCalories / calorieGoal) * 100, 100)
            : 0;

    const proteinProgress =
        proteinGoal > 0
            ? Math.min((totalProtein / proteinGoal) * 100, 100)
            : 0;

    // ================= UI =================
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
        >

            {/* TOP BAR */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.profileButton} onPress={handleProfileUpload}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Profile Image */}
            {profileImage && (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            )}

            <Text style={styles.title}>Dashboard</Text>

            {/* Calorie Goal Editor */}
            <View style={styles.goalEditorRow}>
                <Text style={styles.goalLabel}>🎯 Calorie Goal: <Text style={styles.goalValue}>{calorieGoal} kcal</Text></Text>
                <TouchableOpacity onPress={() => { setGoalInput(String(calorieGoal)); setEditingGoal(!editingGoal); }}>
                    <Text style={styles.editGoalIcon}>{editingGoal ? "✕" : "✏️"}</Text>
                </TouchableOpacity>
            </View>
            {editingGoal && (
                <View style={styles.goalInputRow}>
                    <TextInput
                        style={styles.goalInput}
                        value={goalInput}
                        onChangeText={setGoalInput}
                        keyboardType="numeric"
                        placeholder="New calorie goal"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.saveGoalButton} onPress={handleSaveGoal}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Meal Type Buttons */}
            <View style={styles.mealRow}>
                {["breakfast", "lunch", "dinner"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.mealButton,
                            selectedMeal === type && styles.selectedMeal
                        ]}
                        onPress={() => setSelectedMeal(type)}
                    >
                        <Text style={styles.buttonText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Inputs */}
            <TextInput
                placeholder="Dish Name"
                value={foodName}
                onChangeText={setFoodName}
                style={styles.input}
            />

            <TextInput
                placeholder="Quantity (100g / 2 chapati)"
                value={quantity}
                onChangeText={setQuantity}
                style={styles.input}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
                <Text style={styles.buttonText}>
                    {loading ? "Adding..." : "Add Meal"}
                </Text>
            </TouchableOpacity>

            {/* Macro Table */}
            <View style={[styles.row, { backgroundColor: "#e8f0fe", borderRadius: 6 }]}>
                <Text style={styles.headerCell}>Meal</Text>
                <Text style={styles.headerCell}>Cal</Text>
                <Text style={styles.headerCell}>Prot</Text>
                <Text style={styles.headerCell}>Carb</Text>
                <Text style={styles.headerCell}>Fat</Text>
            </View>

            {[{ name: "Breakfast", data: breakfast },
            { name: "Lunch", data: lunch },
            { name: "Dinner", data: dinner }].map((row) => (
                <View style={styles.row} key={row.name}>
                    <Text style={styles.cell}>{row.name}</Text>
                    <Text style={styles.cell}>{row.data.calories}</Text>
                    <Text style={styles.cell}>{row.data.protein}</Text>
                    <Text style={styles.cell}>{row.data.carbs}</Text>
                    <Text style={styles.cell}>{row.data.fat}</Text>
                </View>
            ))}

            <View style={styles.row}>
                <Text style={styles.cell}>Total</Text>
                <Text style={styles.cell}>{totalCalories}</Text>
                <Text style={styles.cell}>{totalProtein}</Text>
                <Text style={styles.cell}>{totalCarbs}</Text>
                <Text style={styles.cell}>{totalFat}</Text>
            </View>

            {/* Progress */}
            <Text style={styles.section}>Calorie Progress</Text>
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text>{totalCalories} / {calorieGoal} kcal</Text>



            <Text style={styles.section}>Protein Progress</Text>
            <View style={styles.progressContainer}>
                <View style={[styles.proteinBar, { width: `${proteinProgress}%` }]} />
            </View>
            <Text>{totalProtein} / {proteinGoal} g protein</Text>

            {/* Meal List */}
            <Text style={styles.section}>Meals</Text>
            {meals.map((item) => (
                <View key={item.id} style={styles.mealItem}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "bold" }}>
                            {item.foodName} ({item.mealType})
                        </Text>
                        <Text>
                            {item.calories} kcal | {item.protein}P | {item.carbs}C | {item.fat}F
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={{ color: "#fff" }}>X</Text>
                    </TouchableOpacity>
                </View>
            ))}

            {/* Weekly */}
            <Text style={styles.section}>Weekly Calories</Text>
            {Object.keys(weeklyData).map((date) => (
                <Text key={date}>{date}: {weeklyData[date]} kcal</Text>
            ))}

            {/* Scan + Gallery */}
            <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => navigation.navigate("Result")}
            >
                <Text style={styles.buttonText}>Upload From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => navigation.navigate("Scan")}
            >
                <Text style={styles.buttonText}>Scan Food</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetData}
            >
                <Text style={styles.buttonText}>🗑️ Reset Today's Data</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}