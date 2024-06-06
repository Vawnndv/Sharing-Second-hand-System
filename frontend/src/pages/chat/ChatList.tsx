import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, List, ListItem } from '@mui/material';
import { getChatListCollaborator, getChatListUser } from '../../redux/services/chatServices';  
import ChatItem from './ChatItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import toast from 'react-hot-toast';


function ChatList({ searchQuery, typeChat }: any) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const userID = userInfo?.id

  useEffect(() => {
    // Thực hiện fetch dữ liệu từ API
    const fetchData = async () => {
      setIsLoading(true);
      if (userID === undefined) {
        toast.error('Can not get user infomation')
        return
      }
      try {
        if (typeChat === 1) {
          const response = await getChatListCollaborator(userID, searchQuery)
          console.log(typeChat, response)
          setData(response.data);
        } else {
          const response = await getChatListUser(userID, searchQuery)
          console.log(typeChat, response)
          setData(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchQuery]); // Chạy một lần sau khi component được render
  
  return (
    <List sx={{height: '70vh', overflowY: 'auto', my: 2}}>
      {
        isLoading ?
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
        :
        <>
          {data.map((item: any, index: number) => (
            <ListItem key={index}>
              <ChatItem item={item}/>
            </ListItem>
          ))}
        </>
      }
    </List>
  );
}

export default ChatList;
