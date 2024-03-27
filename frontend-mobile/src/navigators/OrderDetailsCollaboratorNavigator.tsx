import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrdersScreen from '../screens/collaborator/OrdersScreen';
import OrderDetailsScreen from '../screens/collaborator/OrderDetailsScreen';

const OrderDetailsCollaboratorNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrderDetailsCollaboratorScreen" component={OrderDetailsScreen} />
    </Stack.Navigator>
  )
}

export default OrderDetailsCollaboratorNavigator