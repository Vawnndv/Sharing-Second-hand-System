import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPostScreen from '../UserPostScreen';
import WarehouseScreen from '../WarehouseScreen';
import { fontFamilies } from '../../../constants/fontFamilies';

const ItemTabComponent = () => {
  const SubTabs = createMaterialTopTabNavigator();
  return (
    <SubTabs.Navigator style={styles.tabs}>
      <SubTabs.Screen
        name="Bài đăng"
        component={UserPostScreen}
        options={{
          tabBarLabel: 'Bài đăng',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
      <SubTabs.Screen
        name="Lưu kho"
        component={WarehouseScreen}
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
    width: '75%',
    backgroundColor: 'transparent',
  },

  tabLabel: {
    textTransform: 'capitalize',
    color: '#552466',
    fontWeight:'bold',
    fontFamily: fontFamilies.medium,
    fontSize: 16,
  },

  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});