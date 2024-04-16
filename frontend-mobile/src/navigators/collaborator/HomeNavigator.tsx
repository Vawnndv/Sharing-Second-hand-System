import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import OrderScreen from '../../screens/order/OrderScreen';
import OrdersScreen from '../../screens/collaborator/OrdersScreen';
import OrderDetailsScreen from '../../screens/collaborator/OrderDetailsScreen';
import MapSettingAddress from '../../screens/map/MapSettingAddress';
import MapSelectWarehouse from '../../screens/map/MapSelectWarehouse';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      
    </Stack.Navigator>
  )
}

export default HomeNavigator