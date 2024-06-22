import React, { useEffect, useState } from 'react';
import { Avatar, Card, Typography, Box, CardActionArea, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoomId } from '../../utils/GetRoomID';
import { doc as firebaseDoc, collection, query, orderBy, onSnapshot, getDocs, limit, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import toast from 'react-hot-toast';
import 'moment/locale/vi';

function ChatItem({ item }: any) {
  const { userInfo } = useSelector((state: RootState) => state.userLogin);
  const userID = userInfo?.id;

  moment.locale('vi'); // Set moment to Vietnamese locale
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const updateRead = async () => {
    if (userID === lastMessage?.userid || userID === undefined) return;
    try {
      const roomID = getRoomId(userID, item?.userid);
      const docRef = firebaseDoc(db, "rooms", roomID); // Rename doc to firebaseDoc
      const messageRef = collection(docRef, "messages");

      const querySnapshot = await getDocs(query(messageRef, orderBy("createdAt", "desc"), limit(1)));
      let lastMess: any = null;

      querySnapshot.forEach((doc) => {
        lastMess = doc;
      });

      if (lastMess) {
        await updateDoc(lastMess.ref, {
          isRead: true
        });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái tin nhắn:', err);
    }
  };

  const handleClickChatRoom = () => {
    if (userID === undefined) {
      toast.error('Không thể lấy thông tin người dùng');
      return;
    }
    updateRead();
    navigate(`/chat/${getRoomId(userID, item?.userid)}`);
  };

  useEffect(() => {
    if (userID === undefined) {
      toast.error('Không thể lấy thông tin người dùng');
      return;
    }

    const roomID = getRoomId(userID, item?.userid);
    const docRef = firebaseDoc(db, "rooms", roomID); // Rename doc to firebaseDoc
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
  }, [userID, item?.userid]);

  const renderTime = () => {
    if (lastMessage && lastMessage.createdAt) {
      const milliseconds = lastMessage.createdAt.seconds * 1000 + lastMessage.createdAt.nanoseconds / 1000000;
      return moment(milliseconds).fromNow();
    }
    return '';
  };

  const renderLastMessage = () => {
    if (lastMessage === undefined)
      return 'Đang tải...';
    if (lastMessage) {
      let mess = lastMessage.text;
      if (lastMessage.type === 'image')
        mess = "Đã gửi ảnh";
      if (userID === lastMessage.userid)
        return `Bạn: ${  mess}`;
      return mess;
    }
    return 'Gửi lời chào 👋';
  };

  return (
    <Card sx={{ flex: 1 }}>
      <CardActionArea onClick={handleClickChatRoom} sx={{ display: 'flex', flex: 1, flexDirection: 'row', py: 2, px: 5 }}>
        <Badge
          badgeContent={<div style={{ width: 16, height: 16, borderRadius: 100, backgroundColor: 'red' }} />}
          invisible={lastMessage?.text === undefined || lastMessage?.isRead || userID === lastMessage?.userid}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          overlap="circular"
        >
          <Avatar alt={item.firstname} sx={{ width: 70, height: 70 }} src={item.avatar} />
        </Badge>
        <Box sx={{ mx: 2, flex: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
            <Typography variant='body1' fontWeight='bold'>{item.firstname} {item.lastname}</Typography>
            <Typography variant='body1' fontStyle='italic' sx={{ opacity: lastMessage?.isRead || userID === lastMessage?.userid ? 0.5 : 1 }}>{renderTime()}</Typography>
          </Box>
          <Typography variant='body1' sx={{ opacity: lastMessage?.isRead || userID === lastMessage?.userid ? 0.5 : 1 }}>{renderLastMessage()}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default ChatItem;
