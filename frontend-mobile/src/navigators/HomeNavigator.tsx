import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeScreen } from '../screens';
import OrderDetailsScreen from '../screens/collaborator/OrderDetailsScreen';
import OrdersScreen from '../screens/collaborator/OrdersScreen';
import StatisticScreen from '../screens/collaborator/StatisticScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import MapSelectWarehouse from '../screens/map/MapSelectWarehouse';
import ChatRoom from '../screens/chat/ChatRoom';
import MapSelectWarehouseGive from '../screens/map/MapSelectWarehouseGive';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
      <Stack.Screen name="MapSelectWarehouseScreen" component={MapSelectWarehouse} />
      <Stack.Screen name="MapSelectWarehouseGiveScreen" component={MapSelectWarehouseGive} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoom} />
    </Stack.Navigator>
  )
}

export default HomeNavigator