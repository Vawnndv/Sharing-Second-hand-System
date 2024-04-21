import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../screens/order/OrderScreen';
import ViewDetailOrder from '../modals/ViewDetailOrder';

const OrderNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="ViewDetailOrder" component={ViewDetailOrder} />
    </Stack.Navigator>
  )
}

export default OrderNavigator