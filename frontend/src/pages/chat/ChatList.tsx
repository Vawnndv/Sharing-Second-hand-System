import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, List, ListItem } from '@mui/material';
import { getAllChatListCollaborator, getChatListCollaborator, getChatListUser } from '../../redux/services/chatServices';  
import ChatItem from './ChatItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import toast from 'react-hot-toast';
import { getRoomId } from '../../utils/GetRoomID';
import { collection, doc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

interface User {
  userid: string;
}

interface LastMessage {
  createdAt: number;
}

interface UserWithLastMessage extends User {
  lastMessage?: LastMessage;
}

function ChatList({ searchQuery, typeChat }: { searchQuery: string; typeChat: number }) {
  const [data, setData] = useState<UserWithLastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.userLogin);
  const userID = userInfo?.id;

  useEffect(() => {
    // Thực hiện fetch dữ liệu từ API
    const fetchData = async () => {
      setIsLoading(true);
      if (userID === undefined) {
        toast.error('Không thể lấy thông tin người dùng');
        return;
      }
      try {
        let response;
        if (typeChat === 1) {
          if (userInfo?.roleID === 3)
            response = await getAllChatListCollaborator(userID, searchQuery);
          else
            response = await getChatListCollaborator(userID, searchQuery);
        } else {
          response = await getChatListUser(userID, searchQuery);
        }

        // Lấy `lastMessage` từ Firebase cho từng chat room
        const dataWithLastMessage = await Promise.all(
          response.data.map(async (item: User) => {
            const roomID = getRoomId(userID, item?.userid);
            const docRef = doc(db, 'rooms', roomID);
            const messagesRef = collection(docRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

            const querySnapshot = await getDocs(q);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const lastMessage = querySnapshot.docs.map((doc) => doc.data() as LastMessage)[0];
            return { ...item, lastMessage };
          })
        );

        // Sắp xếp dữ liệu theo `lastMessage.createdAt`
        dataWithLastMessage.sort((a, b) => {
          if (!a.lastMessage && !b.lastMessage) return 0;
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return b.lastMessage.createdAt - a.lastMessage.createdAt;
        });

        setData(dataWithLastMessage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, typeChat, userID]);

  return (
    <List sx={{ height: '70vh', overflowY: 'auto', my: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {data.map((item, index) => (
            <ListItem key={index}>
              <ChatItem item={item} />
            </ListItem>
          ))}
        </>
      )}
    </List>
  );
}

export default ChatList;
