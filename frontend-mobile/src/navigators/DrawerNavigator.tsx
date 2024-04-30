import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { DrawerCustom } from '../components';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import OrderNavigator from './OrderNavigator';
import TabNavigator from './TabNavigator';
import AccountScreen from '../screens/auth/AccountScreen';
import HistoryScreen from '../screens/order/HistoryScreen';

import ChatScreen from '../screens/chat/ChatScreen';
import ChatRoom from '../screens/chat/ChatRoom';
import MapSettingAddress from '../screens/map/MapSettingAddress';

import ChatNavigator from './ChatNavigator';
import UserLikePostsScreen from '../screens/drawers/UserLikePostsScreen';
import MapSelectWarehouseGive from '../screens/map/MapSelectWarehouseGive';
import FavoritesNavigator from './FavoritesNavigator';


const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator 
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right'
      }}
      drawerContent={props => <DrawerCustom {...props} />}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
      <Drawer.Screen name="MyOrder" component={OrderNavigator} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
      <Drawer.Screen name="MyProfile" component={AccountScreen} />
      <Drawer.Screen name="MapSettingAddressScreen" component={MapSettingAddress} options={{ unmountOnBlur: true }}/>
      <Drawer.Screen name="MapSelectWarehouseGiveScreen" component={MapSelectWarehouseGive} options={{ unmountOnBlur: true }}/>
      <Drawer.Screen name="Chat" component={ChatNavigator} />
      <Drawer.Screen name="MyLike" component={FavoritesNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator