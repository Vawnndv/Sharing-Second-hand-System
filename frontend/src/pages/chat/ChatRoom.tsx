import { Box, Avatar, Typography, TextField, IconButton, List } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MessageItem from './MessageItem';
// import { getRoomId } from '../../utils/GetRoomID';
import { DocumentData, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import toast from 'react-hot-toast';
import { createNewChatUser } from '../../redux/services/chatServices';
import { convert } from '../../utils/GetRoomID';

const userID = '30'

function ChatRoom() {
  const { roomid } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);
  // const [image, setImage] = useState<any>(null);
  // const scrollViewRef = useRef(null);
  // const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const createRoomIfNotExists = async () => {
    const roomID = roomid;

    if (!roomID)
      return;
    const roomRef = doc(db, "rooms", roomID);
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
      // Nếu room chưa tồn tại, tạo room mới
      await setDoc(roomRef, {
          roomID,
          createdAt: Timestamp.fromDate(new Date())
      });

      console.log('CONVERT', convert(roomid))
      await createNewChatUser(userID, convert(roomid).userID2);
    }
  }

  useEffect(() => {
    createRoomIfNotExists();

    const roomID = roomid;
    if (!roomID)
      return;
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    onSnapshot(q, (snapshot)=> {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      if (allMessages !== undefined) {
        setMessages([...allMessages]);
        // setLastMessage(allMessages[0] ? allMessages[0] : null)
      }
    })

    // const keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow', updateScrollView
    // )

    // return () => {
    //   keyboardDidShowListener.remove();
    // }

  }, [])

  // const updateScrollView = () => {
  //   setTimeout(() => {
  //     scrollViewRef?.current?.scrollToEnd({animated: true})
  //   }, 100)
  // }

  // useEffect(() => {
  //   updateScrollView()
  // }, [messages])

  const handleMessageSend = async () => {
    if(!message) return;
    try {
      const roomID =  roomid
      if (!roomID)
        return;
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
      setMessage('')
      await addDoc(messageRef, {
        userid: userID,
        text: message,
        username:  "VAN NGUYEN", // auth?.firstName +  ' '  + auth?.lastName,
        type: 'text',
        createdAt: Timestamp.fromDate(new Date()),
        isRead: false
      })

    } catch(err: any) {
      toast.error(err.message)
    }
  }

  // useEffect(() => {
  //   if (image !== null && Array.isArray(image)) {
  //     (async () => {
  //       for (const img of image) {
  //         try {
  //           const temp = await UploadImageToAws3(img);

  //           const url = temp.url
  //           if (!url) continue;

  //           let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
  //           const docRef = doc(db, "rooms", roomID);
  //           const messageRef = collection(docRef, "messages");

  //           await addDoc(messageRef, {
  //               userid: auth?.id,
  //               text: url,
  //               type: 'image',
  //               createdAt: Timestamp.fromDate(new Date()),
  //               username: auth?.firstName +  ' '  + auth?.lastName,
  //               isRead: false
  //           });

  //           textRef.current = "";
  //           inputRef?.current?.clear();
              
  //         } catch (err: any) {
  //             Alert.alert('Lỗi', err.message);
  //         }
  //       }

  //       setImage(null);
  //     })();
  //   }
  // }, [image]);

  const handleImageSend = async () => {
    // setImage(null);
    // let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
    //   return;
    // }

    // let pickerResult = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
    //   quality: 1,
    // });

    // if (!pickerResult.canceled) {
    //   const imageData = pickerResult.assets.map((asset: any) => {

    //     return {
    //       uri: asset.uri,
    //       name: new Date().getTime() + asset.fileName,
    //       type: asset.mimeType
    //     }
    //   });
    //   setImage(imageData);
    // }
  }

  return (
    <Box sx={{ flex: 1, mx: 2, my: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* Phần "Công chúa lọ lem" */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="Travis Howard" sx={{ ml: 1, width: 70, height: 70 }} src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1nU15m.img?w=678&h=1000&m=6&x=217&y=237&s=173&d=173" />
          <Typography sx={{ ml: 2 }} variant='body1' fontWeight='bold' fontSize={20}>Công chúa lọ lem</Typography>
        </Box>
      </Box>

      {/* Danh sách tin nhắn */}
      <List sx={{height: '70vh', overflowY: 'auto', my: 3}}>
        <MessageItem messages={messages}/>

      </List>

      {/* Phần input chat */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhắn tin"
            fullWidth
            variant="outlined"
          />
          <IconButton onClick={handleImageSend} aria-label="send image">
            <InsertPhotoIcon />
          </IconButton>
          <IconButton onClick={handleMessageSend} aria-label="send message">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatRoom