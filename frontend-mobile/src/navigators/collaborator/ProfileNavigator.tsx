import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../../screens/order/OrderScreen';
import OrderDetailsScreen from '../../screens/collaborator/OrderDetailsScreen';
import StatisticScreen from '../../screens/collaborator/StatisticScreen';
import { ProfileScreen } from '../../screens';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileCollaboratorScreen" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator