import { StyleSheet, Text, View } from 'react-native'
import { getRoomId, getRoomIdWithPost } from '../utils/GetRoomID';
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../../firebaseConfig';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/authReducers';

const LastMessageComponent = ({firstUserID, secondUserID, postid}: any) => {
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);


  const renderLastMessage = () =>{
    let roomID = postid ? getRoomIdWithPost(firstUserID, secondUserID, postid) : getRoomId(firstUserID, secondUserID);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const auth = useSelector(authSelector);

    let unsub = onSnapshot(q, (snapshot)=> {
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      setLastMessage(allMessages[0] ? allMessages[0] : null)
    })
    
    if (lastMessage === undefined)
      return 'Đang tải...';
    if (lastMessage) {
      let mess = lastMessage?.text
      if (lastMessage.type == 'image')
        mess = "Đã gửi ảnh"
      if(auth?.id == lastMessage.userid)
        return "Bạn: " + mess;
      return mess;
    } else {
      return 'Gửi lời chào 👋'
    }
  }

  return (
    <View>
      <Text style={styles.comment}>{renderLastMessage()}</Text>
    </View>
  )
}

export default LastMessageComponent

const styles = StyleSheet.create({
  comment: {
    fontStyle: 'italic', // Nghiêng chữ
    marginTop: 20,
  }
})