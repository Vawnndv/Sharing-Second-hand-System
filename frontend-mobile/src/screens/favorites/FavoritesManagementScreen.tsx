import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import GiveOrderScreen from '../../components/OrderManagement/GiveOrderScreen';
import UserLikePostsScreen from '../drawers/UserLikePostsScreen';
import ReceiveScreen from './ReceiveScreen';

const SubTabs = createMaterialTopTabNavigator();

function FavoritesManagementScreen() {
  return (
    <SubTabs.Navigator 
      style={styles.tabs}
      screenOptions={({ route }) => ({
        tabBarLabelStyle: styles.tabLabel,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarActiveTintColor: '#552466',
        tabBarInactiveTintColor: '#666',
      })}
    >
      <SubTabs.Screen
        name="UserLikePostsScreen"
        component={UserLikePostsScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
        }}
      />
      <SubTabs.Screen
        name="ReceiveScreen"
        component={ReceiveScreen}
        options={{
          tabBarLabel: 'Đã xin',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
        }}
      />
    </SubTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  tabItem: {
    width: '70%',
    backgroundColor: 'transparent',
  },
  tabLabel: {
    textTransform: 'capitalize',
    fontWeight:'bold',
    fontSize: 17,
  },
  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});

export default FavoritesManagementScreen;
