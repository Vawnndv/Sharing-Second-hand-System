import React, { useEffect, useState } from 'react';
import { List, ListItem } from '@mui/material';
import { getChatListCollaborator, getChatListUser } from '../../redux/services/chatServices';  
import ChatItem from './ChatItem';

const userID = '30'

function ChatList({ typeChat }: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Thực hiện fetch dữ liệu từ API
    const fetchData = async () => {
      try {
        if (typeChat === 1) {
          const response = await getChatListCollaborator(userID)
          console.log(typeChat, response)
          setData(response.data);
        } else {
          const response = await getChatListUser(userID)
          console.log(typeChat, response)
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Chạy một lần sau khi component được render
  
  return (
    <List sx={{height: '70vh', overflowY: 'auto', my: 2}}>
      {data.map((item: any, index: number) => (
        <ListItem key={index}>
          <ChatItem item={item}/>
        </ListItem>
      ))}
    </List>
  );
}

export default ChatList;
