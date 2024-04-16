import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatScreen from '../screens/chat/ChatScreen';
import ChatRoom from '../screens/chat/ChatRoom';

const ChatNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoom} />
    </Stack.Navigator>
  )
}

export default ChatNavigator