import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatRoom from '../screens/chat/ChatRoom';
import ChatManagementScreen from '../screens/chat/ChatManagementScreen';

const ChatNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatScreen" component={ChatManagementScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoom} />
    </Stack.Navigator>
  )
}

export default ChatNavigator