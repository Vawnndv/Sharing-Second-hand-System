import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ViewDetailOrder from '../modals/ViewDetailOrder';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';

const FavoritesNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="ViewDetailOrder" component={ViewDetailOrder} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default FavoritesNavigator