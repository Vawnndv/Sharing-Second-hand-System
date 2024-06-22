import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatRoom from '../screens/chat/ChatRoom';
import ChatManagementScreen from '../screens/chat/ChatManagementScreen';

const ChatNavigator = ({ setUnreadCount }: any) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatScreen">
        {(props) => <ChatManagementScreen {...props} setUnreadCount={setUnreadCount} />}
      </Stack.Screen>
      <Stack.Screen name="ChatRoomScreen" component={ChatRoom} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
