import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ChatList from './ChatList';
import { ActivityIndicator } from 'react-native-paper';
import chatAPI from '../../apis/chatApi';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { useFocusEffect } from '@react-navigation/native';
import { getRoomId, getRoomIdWithPost } from '../../utils/GetRoomID';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { processRooms } from '../../utils/messageUtils';
import { UnreadCountContext } from './UnreadCountContext';

interface User {
  userid: string;
  postid?: string;
  latestMessage?: {
    createdAt: number;
  };
  // Thêm các trường khác nếu cần thiết
}

const ChatUserScreen = ({ router, navigation }: any) => {
  const { setUnreadCount } = useContext(UnreadCountContext) ?? { setUnreadCount: () => {} };
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);

  useFocusEffect(
    React.useCallback(() => {
      getUsers();

      processRooms(auth.id, setUnreadCount!);
    }, [])
  );

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const res = await chatAPI.HandleChat(
        `/listUser?userID=${auth?.id}`,
        'get'
      );
      const usersWithLatestMessage = await Promise.all(res.data.map(async (item: User) => {
        const roomID = item.postid ? getRoomIdWithPost(auth?.id, item?.userid, item?.postid) : getRoomId(auth?.id, item?.userid);
        const docRef = doc(db, "rooms", roomID);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1)); // lấy tin nhắn mới nhất

        const querySnapshot = await getDocs(q);
        const latestMessage = querySnapshot.docs.map(doc => doc.data())[0];
        return { ...item, latestMessage };
      }));

      // Sắp xếp users dựa trên thời gian của tin nhắn mới nhất
      usersWithLatestMessage.sort((a, b) => {
        if (!a.latestMessage && !b.latestMessage) return 0;
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return b.latestMessage.createdAt - a.latestMessage.createdAt;
      });

      setUsers(usersWithLatestMessage);
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <View 
      style={{flex: 1}}
    >
      <StatusBar style='light'/>

      {
        isLoading ? (
          <View style={{display: 'flex', alignItems: 'center', paddingTop: 30}}>
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} /> 
          </View>
        ) : (
          users.length > 0 ? (
            <ChatList route={router} navigation={navigation} users={users}/>
          ) : (
            <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../../assets/images/shopping.png')}
                style={styles.image} 
                resizeMode="contain"
              />
            </View>
          )
        )
      }
    </View>
  );
}

export default ChatUserScreen;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
});
