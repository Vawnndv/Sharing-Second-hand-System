import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeScreen } from '../screens';
import OrderDetailsScreen from '../screens/collaborator/OrderDetailsScreen';
import OrdersScreen from '../screens/collaborator/OrdersScreen';
import StatisticScreen from '../screens/collaborator/StatisticScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    
    </Stack.Navigator>
  )
}

export default HomeNavigator