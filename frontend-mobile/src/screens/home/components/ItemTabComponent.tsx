import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPostComponent from './UserPostComponent';
import WarehouseComponent from './WarehouseComponent';

const ItemTabComponent = () => {
  const SubTabs = createMaterialTopTabNavigator();
  return (
    <SubTabs.Navigator style={styles.tabs}>
      <SubTabs.Screen
        name="Bài đăng"
        component={UserPostComponent}
        options={{
          tabBarLabel: 'Bài đăng',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
      <SubTabs.Screen
        name="Lưu kho"
        component={WarehouseComponent}
        options={{
          tabBarLabel: 'Lưu kho',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
    </SubTabs.Navigator>
  );
}

export default ItemTabComponent;
  
const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  tabItem: {
    width: '60%',
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