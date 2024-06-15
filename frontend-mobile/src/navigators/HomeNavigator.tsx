import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeScreen, ProfileScreen, ThankYouScreen } from '../screens';
import OrderDetailsScreen from '../screens/collaborator/OrderDetailsScreen';
import OrdersScreen from '../screens/collaborator/OrdersScreen';
import StatisticScreen from '../screens/collaborator/StatisticScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import MapSelectWarehouse from '../screens/map/MapSelectWarehouse';
import ChatRoom from '../screens/chat/ChatRoom';
import MapSelectWarehouseGive from '../screens/map/MapSelectWarehouseGive';
import ReceiveFormScreen from '../screens/receiveform/ReceiveFormScreen';
import MapSettingAddress from '../screens/map/MapSettingAddress';
import NotificationScreen from '../screens/notifications/NotificationScreen';


const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
      <Stack.Screen name="ReceiveFormScreen" component={ReceiveFormScreen} />
      <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
      <Stack.Screen name="MapSettingAddressScreen" component={MapSettingAddress}/>
      <Stack.Screen name="MapSelectWarehouseScreen" component={MapSelectWarehouse} />
      <Stack.Screen name="MapSelectWarehouseGiveScreen" component={MapSelectWarehouseGive} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoom} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  )
}

export default HomeNavigator