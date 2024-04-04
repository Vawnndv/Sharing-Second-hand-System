import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { DrawerCustom } from '../components';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import OrderScreen from '../screens/order/OrderScreen';
import TabNavigator from './TabNavigator';
import AccountScreen from '../screens/auth/AccountScreen';
import HistoryScreen from '../screens/order/HistoryScreen';

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
      <Drawer.Screen name="MyOrder" component={OrderScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
      <Drawer.Screen name="MyProfile" component={AccountScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator