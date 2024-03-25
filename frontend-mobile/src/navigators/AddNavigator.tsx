import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AddScreen } from '../screens';

const AddNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AddScreen" component={AddScreen} />
    </Stack.Navigator>
  )
}

export default AddNavigator