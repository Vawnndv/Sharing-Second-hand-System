import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../screens/order/OrderScreen';
const OrderNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
    </Stack.Navigator>
  )
}

export default OrderNavigator