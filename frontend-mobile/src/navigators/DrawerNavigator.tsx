import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerCustom } from '../components';
import TabNavigator from './TabNavigator';
import OrderScreen from '../screens/order/OrderScreen';
import NotificationScreen from '../screens/notifications/NotificationScreen';

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
      <Drawer.Screen name="Notification" component={NotificationScreen} />

    </Drawer.Navigator>
  )
}

export default DrawerNavigator