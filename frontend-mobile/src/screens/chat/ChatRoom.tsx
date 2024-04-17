import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native'
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
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot, DocumentData, getDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload'
import chatAPI from '../../apis/chatApi'

const ChatRoom = ({ route, navigation }: any) => {
  const { item } = route.params;
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [image, setImage] = useState<any>(null);
  const textRef = useRef('');
  const inputRef = useRef<TextInput | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

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

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    )

    return () => {
      keyboardDidShowListener.remove();
    }

  }, [])

  useEffect(() => {
    updateScrollView()
  }, [messages])

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true})
    }, 100)
  }

  const createRoomIfNotExists = async () => {
    let roomID = getRoomId(auth?.id, item?.userid);
    const roomRef = doc(db, "rooms", roomID);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      // Nếu room chưa tồn tại, tạo room mới
      await setDoc(roomRef, {
          roomID,
          createdAt: Timestamp.fromDate(new Date())
      });

      const res = await chatAPI.HandleChat(
        `/createNewChat`,
        {firstuserid: auth.id , seconduserid: item?.userid},
        'post'
      );
    }
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
        type: 'text',
        createdAt: Timestamp.fromDate(new Date())
      })

    } catch(err: any) {
      Alert.alert('Lỗi', err.message)
    }
  }

  useEffect(() => {
    if (image !== null && Array.isArray(image)) {
      (async () => {
        for (const img of image) {
          try {
            const temp = await UploadImageToAws3(img);
            console.log('START')

            console.log('TEMP', temp)
            const url = temp.url
            if (!url) continue;

            let roomID = getRoomId(auth?.id, item?.userid);
            const docRef = doc(db, "rooms", roomID);
            const messageRef = collection(docRef, "messages");

            await addDoc(messageRef, {
                userid: auth?.id,
                text: url,
                type: 'image',
                createdAt: Timestamp.fromDate(new Date()),
                username: auth?.username,
            });

            textRef.current = "";
            inputRef?.current?.clear();
              
          } catch (err: any) {
              Alert.alert('Lỗi', err.message);
          }
        }

        setImage(null);
      })();
    }
  }, [image]);

  const handleSendImage = async () => {
    setImage(null);
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageData = pickerResult.assets.map((asset: any) => {

        return {
          uri: asset.uri,
          name: new Date().getTime() + asset.fileName,
          type: asset.mimeType
        }
      });
      setImage(imageData);
    }
  }

  return (
    <ContainerComponent>
      <ChatRoomHeader route={route} navigation={navigation} user={item}/>
      <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: appColors.gray5, overflow: 'visible'}}>
        <View style={{flex: 1}}>
          <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={auth}/>
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
              <TouchableOpacity onPress={handleSendImage} style={{marginRight: 10, padding: 10, borderRadius: 100, backgroundColor: appColors.gray5}}>
                <Feather name="image" size={hp(2.7)} color={'#737373'}></Feather>
              </TouchableOpacity>
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