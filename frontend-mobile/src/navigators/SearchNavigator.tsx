import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchScreen from '../screens/search/SearchScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';

const SearchNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default SearchNavigator