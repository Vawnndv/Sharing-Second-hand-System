import { Box, Avatar, Typography, TextField, IconButton, List } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MessageItem from './MessageItem';
import { DocumentData, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import toast from 'react-hot-toast';
import { createNewChatUser, getWareHouseByUserID } from '../../redux/services/chatServices';
import { convert } from '../../utils/GetRoomID';
import { styled } from '@mui/material/styles';
import UploadImageToAws3 from '../../utils/UploadImage';
import { getProfileService } from '../../redux/services/userServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function ChatRoom({ typeChat }: any) {
  const { roomid } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [warehouse, setWarehouse] = useState<any>(null);

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const userID = userInfo?.id

  const createRoomIfNotExists = async () => {
    if (userID === undefined) {
      toast.error('Can not get user infomation')
      return
    }
    const roomID = warehouse ? `${warehouse.warehouseid}` : roomid;
    if (!roomID) return;

    const roomRef = doc(db, "rooms", roomID);
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
      await setDoc(roomRef, {
        roomID,
        createdAt: Timestamp.fromDate(new Date())
      });
      if (!warehouse) await createNewChatUser(userID, userID?.toString() !== convert(roomid).userID2 ? convert(roomid).userID2 : convert(roomid).userID1);
    }
  };

  const getProfile = async () => {
    const res = await getProfileService(userID?.toString() !== convert(roomid).userID2 ? convert(roomid).userID2 : convert(roomid).userID1);
    setProfile(res);
  };

  const getWareHouse = async () => {
    if (userID === undefined) {
      toast.error('Can not get user infomation')
      return
    }
    const res = await getWareHouseByUserID(userID);
    setWarehouse(res.data[0]);
  };

  const getMessages = async () => {
    const roomID = warehouse !== null ? `${warehouse.warehouseid}` : roomid;
    if (!roomID) return;
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    onSnapshot(q, (snapshot) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const allMessages = snapshot.docs.map(doc => doc.data());
      if (allMessages !== undefined) {
        setMessages([...allMessages]);
      }
    });

    if (listRef.current) {
      const { current: list } = listRef;
      list.scrollTop = list.scrollHeight;
    }
  };

  useEffect(() => {
    if (typeChat === 3) getWareHouse();
    else getProfile();

    createRoomIfNotExists();
    getMessages();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      const { current: list } = listRef;
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    createRoomIfNotExists();
    getMessages();
  }, [warehouse]);

  const handleMessageSend = async () => {
    if (!message) return;
    try {
      const roomID = warehouse ? `${warehouse.warehouseid}` : roomid;
      if (!roomID) return;
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
      setMessage('');
      await addDoc(messageRef, {
        userid: userID,
        text: message,
        username: `${userInfo?.firstName} ${userInfo?.lastName}`,
        type: 'text',
        createdAt: Timestamp.fromDate(new Date()),
        isRead: false
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files || []);
    files.forEach(async (file) => {
      try {
        const responseUploadImage: any = await UploadImageToAws3(file, false);

        const roomID = warehouse ? `${warehouse.warehouseid}` : roomid;
        if (!roomID) return;
        const docRef = doc(db, "rooms", roomID);
        const messageRef = collection(docRef, "messages");

        await addDoc(messageRef, {
          userid: userID,
          text: responseUploadImage.url,
          type: 'image',
          createdAt: Timestamp.fromDate(new Date()),
          username: "VAN NGUYEN",
          isRead: false
        });
        toast.success('Image Upload successfully');
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Network Error');
        }
      }
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleMessageSend();
    }
  };

  return (
    <Box sx={{ flex: 1, mx: 2, my: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {warehouse ? (
            <Typography sx={{ ml: 2 }} variant='body1' fontWeight='bold' fontSize={20}>{warehouse.warehousename}</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Avatar alt="Travis Howard" sx={{ ml: 1, width: 50, height: 50 }} src={profile?.avatar} />
              <Typography sx={{ ml: 2 }} variant='body1' fontWeight='bold' fontSize={20}>{profile?.firstName} {profile?.lastName}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <List sx={{height: 'calc(100vh - 200px)', overflowY: 'auto', my: 3, padding: 0 }} ref={listRef}>
        <MessageItem messages={messages} typeChat={typeChat} />
      </List>

      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px 30px' }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhắn tin"
          fullWidth
          variant="outlined"
          sx={{ marginRight: '10px' }}
          onKeyPress={handleKeyPress}
        />
        <IconButton onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.addEventListener('change', handleFileChange);
          input.click();
        }} aria-label="send image">
          <InsertPhotoIcon />
        </IconButton>
        <IconButton onClick={handleMessageSend} aria-label="send message">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatRoom;
