import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import ChatScreen from './ChatScreen';
import ChatUserScreen from './ChatUserScreen';
import ContainerComponent from '../../components/ContainerComponent';

const SubTabs = createMaterialTopTabNavigator();

function ChatManagementScreen() {
  return (
    <ContainerComponent back right title='Tin nhắn'>
      <SubTabs.Navigator style={styles.tabs}>
        <SubTabs.Screen
          name="ChatPost"
          component={ChatScreen}
          options={{
            tabBarLabel: 'Trao đổi đồ',
            tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
            tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
            tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
          }}
        />
        <SubTabs.Screen
          name="ChatUser"
          component={ChatUserScreen}
          options={{
            tabBarLabel: 'Người dùng',
            tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
            tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
            tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
          }}
        />
      </SubTabs.Navigator>
    </ContainerComponent>
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
    color: '#552466',
    fontWeight:'bold',
    fontSize: 17,
  },
  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});

export default ChatManagementScreen;
