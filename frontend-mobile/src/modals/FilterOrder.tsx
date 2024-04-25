import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import HistoryScreen from '../components/OrderManagement/HistoryScreen';
import TrackingScreen from '../components/OrderManagement/TrackingScreen';

const SubTabs = createMaterialTopTabNavigator();

function OrderManagementScreen() {
  return (
    <SubTabs.Navigator style={styles.tabs}>
      <SubTabs.Screen
        name="Theo vết"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Theo vết',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
      <SubTabs.Screen
        name="Lịch sử"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Lịch sử',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
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
    width: '50%',
    backgroundColor: 'transparent',
  },
  tabLabel: {
    textTransform: 'capitalize',
    color: '#552466',
    fontWeight:'bold',
    fontSize: 17,
  },
  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});

export default OrderManagementScreen;
