import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainNavigator from '../../navigators/MainNavigator';

const AppRouters = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  )
}

export default AppRouters