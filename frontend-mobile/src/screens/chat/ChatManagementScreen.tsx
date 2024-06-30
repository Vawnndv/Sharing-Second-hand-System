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
            name="ChatPost"
            component={ChatScreen}
            options={{
              tabBarLabel: 'Trao đổi đồ',
              tabBarStyle: styles.tabItem,
            }}
          />
          <SubTabs.Screen
            name="ChatUser"
            component={ChatUserScreen}
            options={{
              tabBarLabel: 'Người dùng',
              tabBarStyle: styles.tabItem,
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
    fontWeight: 'bold',
    fontSize: 17,
  },
  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});

export default ChatManagementScreen;
