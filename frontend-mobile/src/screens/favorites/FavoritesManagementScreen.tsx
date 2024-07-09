import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import GiveOrderScreen from '../../components/OrderManagement/GiveOrderScreen';
import UserLikePostsScreen from '../drawers/UserLikePostsScreen';
import ReceiveScreen from './ReceiveScreen';
import TabComponent from '../../components/TabComponent';

const SubTabs = createMaterialTopTabNavigator();

function FavoritesManagementScreen() {
  return (
    <SubTabs.Navigator 
      tabBar={props => (
        <TabComponent
          {...props}
        />
      )}
    >
      <SubTabs.Screen
        name="UserLikePostsScreen"
        component={UserLikePostsScreen}
        options={{
          tabBarLabel: 'Yêu thích',
        }}
      />
      <SubTabs.Screen
        name="ReceiveScreen"
        component={ReceiveScreen}
        options={{
          tabBarLabel: 'Đã xin',
        }}
      />
    </SubTabs.Navigator>
  );
}


export default FavoritesManagementScreen;
