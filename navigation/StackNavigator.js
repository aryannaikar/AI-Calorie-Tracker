// navigation/StackNavigator.js

import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import ProfileSetupScreen from "../screens/ProfileSetup/ProfileSetupScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import ResultScreen from "../screens/Result/ResultScreen";
import ScanScreen from "../screens/Scan/ScanScreen";

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
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
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