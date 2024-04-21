import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScanScreen } from '../screens';
import ViewDetailOrder from '../modals/ViewDetailOrder';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';

const ScanNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
      <Stack.Screen name="ViewDetailOrder" component={ViewDetailOrder} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default ScanNavigator