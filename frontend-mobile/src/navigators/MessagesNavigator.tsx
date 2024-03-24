import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MessageScreen } from '../screens';

const MessagesNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
    </Stack.Navigator>
  )
}

export default MessagesNavigator