// screens/chat/ChatManagementScreen.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';
import ChatUserScreen from './ChatUserScreen';
import ContainerComponent from '../../components/ContainerComponent';
import { UnreadCountContext } from './UnreadCountContext';

const SubTabs = createMaterialTopTabNavigator();

const ChatManagementScreen = ({ setUnreadCount }: any) => {
  return (
    <UnreadCountContext.Provider value={{ setUnreadCount }}>
      <ContainerComponent back right title='Tin nhắn'>
        <SubTabs.Navigator style={styles.tabs}>
          <SubTabs.Screen
            name="ChatPost"
            component={ChatScreen}
            options={{
              tabBarLabel: 'Trao đổi đồ',
              tabBarStyle: styles.tabItem,
              tabBarLabelStyle: styles.tabLabel,
              tabBarIndicatorStyle: styles.tabIndicator,
            }}
          />
          <SubTabs.Screen
            name="ChatUser"
            component={ChatUserScreen}
            options={{
              tabBarLabel: 'Người dùng',
              tabBarStyle: styles.tabItem,
              tabBarLabelStyle: styles.tabLabel,
              tabBarIndicatorStyle: styles.tabIndicator,
            }}
          />
        </SubTabs.Navigator>
      </ContainerComponent>
    </UnreadCountContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  tabItem: {
    width: '70%',
    backgroundColor: 'transparent',
  },
  tabLabel: {
    textTransform: 'capitalize',
    color: '#552466',
    fontWeight: 'bold',
    fontSize: 17,
  },
  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});

export default ChatManagementScreen;
