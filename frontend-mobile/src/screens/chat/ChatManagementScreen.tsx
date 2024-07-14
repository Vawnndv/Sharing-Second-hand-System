// screens/chat/ChatManagementScreen.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';
import ChatUserScreen from './ChatUserScreen';
import ContainerComponent from '../../components/ContainerComponent';
import { UnreadCountContext } from './UnreadCountContext';
import TabComponent from '../../components/TabComponent';

const SubTabs = createMaterialTopTabNavigator();

const ChatManagementScreen = ({ setUnreadCount, route }: any) => {
  const isMenuNavigate = route.params ? route.params.isMenuNavigate : false;

  return (
    <UnreadCountContext.Provider value={{ setUnreadCount }}>
      <ContainerComponent back={isMenuNavigate} right={!isMenuNavigate} title={isMenuNavigate ? 'Tin nhắn' : ''}>
        <SubTabs.Navigator
         tabBar={props => (
          <TabComponent
            {...props}
            isHome={!isMenuNavigate}
          />
        )}
        >
          <SubTabs.Screen
            name="ChatPost"
            component={ChatScreen}
            options={{
              tabBarLabel: 'Trao đổi đồ',
            }}
          />
          <SubTabs.Screen
            name="ChatUser"
            component={ChatUserScreen}
            options={{
              tabBarLabel: 'Liên hệ',
            }}
          />
        </SubTabs.Navigator>
      </ContainerComponent>
    </UnreadCountContext.Provider>
  );
};

export default ChatManagementScreen;
