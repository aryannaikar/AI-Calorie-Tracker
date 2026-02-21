// screens/Splash/SplashScreen.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Calorie Tracker</Text>
      <Text style={styles.subtitle}>Login Successful 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold"
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16
  }
});