import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../screens/order/OrderScreen';
import ViewDetailOrder from '../modals/ViewDetailOrder';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import HistoryScreen from '../screens/order/HistoryScreen';

const HistoryNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="ViewDetailOrder" component={ViewDetailOrder} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
    </Stack.Navigator>
  )
}

export default HistoryNavigator