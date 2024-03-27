import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../../screens/order/OrderScreen';
import OrderDetailsScreen from '../../screens/collaborator/OrderDetailsScreen';
import StatisticScreen from '../../screens/collaborator/StatisticScreen';

const StatisticNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StatisticScreen" component={StatisticScreen} />
    </Stack.Navigator>
  )
}

export default StatisticNavigator