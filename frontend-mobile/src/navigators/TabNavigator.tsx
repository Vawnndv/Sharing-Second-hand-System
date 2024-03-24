import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens';

const TabNavigator = () => {
  const Tab = createNativeStackNavigator();

  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator