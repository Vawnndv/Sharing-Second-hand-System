import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import PostScreen from '../screens/posts/PostScreen';
import ViewPostManagement from '../screens/posts/ViewPostManagement';

const FavoritesNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PostScreen" component={PostScreen} />
      <Stack.Screen name="ViewPostManagement" component={ViewPostManagement} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default FavoritesNavigator