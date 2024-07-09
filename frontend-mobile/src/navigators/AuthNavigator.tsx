import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ForgotPasswordScreen, LoginScreen, RegisterScreen, VerificationScreen } from '../screens';
import React from "react";
const authNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterSCreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
    </Stack.Navigator>
  )
}

export default authNavigator