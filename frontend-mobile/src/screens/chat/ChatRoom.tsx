import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ContainerComponent } from '../../components'
import ChatRoomHeader from './ChatRoomHeader'
import { appColors } from '../../constants/appColors'
import MessageList from './MessageList'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'
import { getRoomId } from '../../utils/GetRoomID'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'

const ChatRoom = ({ route, navigation }: any) => {
  const { item } = route.params;
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);

  const auth = useSelector(authSelector);

  useEffect(() => {
    createRoomIfNotExists();

    let roomID = getRoomId(auth?.id, item?.userid);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    let unsub = onSnapshot(q, (snapshot)=> {
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      if (allMessages !== undefined) {
        setMessages([...allMessages]);
      }
    })

  }, [])

  const createRoomIfNotExists = async () => {
    let roomID = getRoomId(auth?.id, item?.userid);
    await setDoc(doc(db, "rooms", roomID), {
      roomID,
      createdAt: Timestamp.fromDate(new Date())
    })
  }

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if(!message) return;
    try {
      let roomID = getRoomId(auth?.id, item?.userid)
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if(inputRef) inputRef?.current?.clear()
      const newDoc = await addDoc(messageRef, {
        // userid: auth?.id,
        // text: message,
        // avatar: auth?.avatar,
        // firstname: auth?.firstname,
        // lastname: auth?.lastname,
        // createdAt: Timestamp.fromDate(new Date())
        userid: auth?.id,
        text: message,
        username: auth?.username,
        createdAt: Timestamp.fromDate(new Date())
      })

    } catch(err: any) {
      Alert.alert('Lỗi', err.message)
    }
  }

  return (
    <ContainerComponent>
      <ChatRoomHeader route={route} navigation={navigation} user={item}/>
      <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: appColors.gray5, overflow: 'visible'}}>
        <View style={{flex: 1}}>
          <MessageList messages={messages} currentUser={auth}/>
        </View>
        <View style={{marginBottom: hp(2), paddingTop: hp(2)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 3}}>
            <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: appColors.white, borderRadius: 100, borderWidth: 0.2}}>
              <TextInput
                ref={inputRef}
                onChangeText={value => textRef.current = value}
                placeholder='Nhắn tin'
                style={{fontSize: hp(2.3), flex: 1, height: hp(5), paddingHorizontal: 20}}
              />
              <TouchableOpacity onPress={handleSendMessage} style={{padding: 10, borderRadius: 100, backgroundColor: appColors.gray5}}>
                <Feather name="send" size={hp(2.7)} color={'#737373'}></Feather>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ContainerComponent>
  )
}

export default ChatRoom

const styles = StyleSheet.create({})