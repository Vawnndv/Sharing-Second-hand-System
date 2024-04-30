import React, { useEffect, useState } from 'react';
import { Avatar, Card, Typography, Box, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoomId } from '../../utils/GetRoomID';
import { doc, collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import moment from 'moment';
import 'moment/locale/vi';

const userID = '30'

function ChatItem({item}: any) {
  moment.locale();
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const handleClickChatRoom = () => {
    navigate(`/chat/${getRoomId(userID, item?.userid)}`);
  };

  useEffect(() => {

    const roomID = getRoomId(userID, item?.userid);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot)=> {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      setLastMessage(allMessages[0] ? allMessages[0] : null)
    })

  }, [])

  const renderTime = () =>{
    if (lastMessage) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const milliseconds = lastMessage?.createdAt.seconds * 1000 + lastMessage?.createdAt.nanoseconds / 1000000;
      return moment(milliseconds).fromNow()
    }
    return ''
  }

  const renderLastMessage = () =>{
    if (lastMessage === undefined)
      return 'Loading...';
    if (lastMessage) {
      let mess = lastMessage?.text
      if (lastMessage.type === 'image')
        mess = "Đã gửi ảnh"
      if(userID === lastMessage.userid)
        // eslint-disable-next-line prefer-template
        return "You: " + mess;
      return mess;
    }
    return 'Gửi lời chào 👋'
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardActionArea onClick={() => handleClickChatRoom()} sx={{ display: 'flex', flex: 1, flexDirection: 'row', py: 2 }}>
        <Avatar alt={item.firstname} sx={{ ml: 1, width: 70, height: 70 }} src={item.avatar} />
        <Box sx={{ mx: 2, flex: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
            <Typography variant='body1' fontWeight='bold'>{item.firstname}  {item.lastname}</Typography>
            <Typography variant='body1' fontStyle='italic' sx={{ opacity: 0.5 }}>{renderTime()}</Typography>
          </Box>
          <Typography variant='body1' sx={{ opacity: 0.5 }}>{renderLastMessage()}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default ChatItem