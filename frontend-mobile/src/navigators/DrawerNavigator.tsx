import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerCustom } from '../components';
import TabNavigator from './TabNavigator';
import OrderManagementScreen from '../screens/order/OrderManagementScreen';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator 
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right'
      }}
      drawerContent={props => <DrawerCustom {...props} />}
      initialRouteName="TabNavigator"
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
      <Drawer.Screen name="MyOrder" component={OrderManagementScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator