import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScanScreen } from '../screens';

const ScanNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
    </Stack.Navigator>
  )
}

export default ScanNavigator