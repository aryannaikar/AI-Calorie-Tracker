// screens/Register/RegisterScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account Created!");
      navigation.navigate("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already registered. Please login.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate("Login")}>
        Already have account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});