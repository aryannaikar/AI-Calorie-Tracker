// navigation/StackNavigator.js

import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import ProfileSetupScreen from "../screens/ProfileSetup/ProfileSetupScreen";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import ScanScreen from "../screens/Scan/ScanScreen";
import ResultScreen from "../screens/Result/ResultScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { user, profileExists } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        profileExists ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </>
        ) : (
          <Stack.Screen
            name="ProfileSetup"
            component={ProfileSetupScreen}
          />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}