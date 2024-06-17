import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ContainerComponent } from '../../components'
import ChatRoomHeader from './ChatRoomHeader'
import { appColors } from '../../constants/appColors'
import MessageList from './MessageList'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'
import { getRoomId, getRoomIdWithPost } from '../../utils/GetRoomID'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot, DocumentData, getDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload'
import chatAPI from '../../apis/chatApi'
import postsAPI from '../../apis/postApi'
import itemsAPI from '../../apis/itemApi'
import { appInfo } from '../../constants/appInfos'
import { fontFamilies } from '../../constants/fontFamilies'
import axiosClient from '../../apis/axiosClient'

const ChatRoom = ({ route, navigation }: any) => {
  const { item, postid } = route.params;
  const [isChatWithPost, setIsChatWithPost] = useState(false);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [image, setImage] = useState<any>(null);
  const textRef = useRef('');
  const inputRef = useRef<TextInput | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const auth = useSelector(authSelector);

  useEffect(() => {
    postid && setIsChatWithPost(true);

    createRoomIfNotExists();

    let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    let unsub = onSnapshot(q, (snapshot)=> {
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      if (allMessages !== undefined) {
        setMessages([...allMessages]);
        setLastMessage(allMessages[0] ? allMessages[0] : null)
      }
    })

    if (lastMessage != undefined && !lastMessage) {
      
    }

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
    let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
    const roomRef = doc(db, "rooms", roomID);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      // Nếu room chưa tồn tại, tạo room mới
      await setDoc(roomRef, {
          roomID,
          createdAt: Timestamp.fromDate(new Date())
      });

      postid && await handleSendPost()

      const res = await chatAPI.HandleChat(
        `/createNewChat`,
        {firstuserid: auth.id , seconduserid: item?.userid, postid: postid},
        'post'
      );
    }
  }

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if(!message) return;
    try {
      let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if(inputRef) inputRef?.current?.clear()
      const newDoc = await addDoc(messageRef, {
        userid: auth?.id,
        text: message,
        username: auth?.firstName +  ' '  + auth?.lastName,
        type: 'text',
        createdAt: Timestamp.fromDate(new Date()),
        isRead: false
      })

    } catch(err: any) {
      Alert.alert('Lỗi', err.message)
    }
  }

  const handleSendPost = async () => {
    try {
      let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if(inputRef) inputRef?.current?.clear()

      const res: any = await axiosClient.get(`${appInfo.BASE_URL}/posts/${postid}`)
      
      const res_image: any = await axiosClient.get(`${appInfo.BASE_URL}/items/images/${res.postDetail.itemid}`)

      const post = res.postDetail;
      const uri = res_image.itemImages[0].path
      const newDoc = await addDoc(messageRef, {
        userid: auth?.id,
        text: 'Tôi muốn xin món đồ này',
        username: auth?.firstName +  ' '  + auth?.lastName,
        title: post?.title,
        postid: postid,
        uri: uri,
        type: 'post',
        createdAt: Timestamp.fromDate(new Date()),
        isRead: false
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
            const temp = await UploadImageToAws3(img, false);
            console.log('START')

            console.log('TEMP', temp)
            const url = temp.url
            if (!url) continue;

            let roomID = postid ? getRoomIdWithPost(auth?.id, item?.userid, postid) : getRoomId(auth?.id, item?.userid);
            const docRef = doc(db, "rooms", roomID);
            const messageRef = collection(docRef, "messages");

            await addDoc(messageRef, {
                userid: auth?.id,
                text: url,
                type: 'image',
                createdAt: Timestamp.fromDate(new Date()),
                username: auth?.firstName +  ' '  + auth?.lastName,
                isRead: false
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
          <MessageList route={route} navigation={navigation} scrollViewRef={scrollViewRef} messages={messages} currentUser={auth}/>
        </View>
        <View style={{marginBottom: hp(2), paddingTop: hp(2)}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 3}}>
            { item.enablechat == "false" ? ( 
              <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{fontFamily: fontFamilies.light, fontStyle: 'italic', opacity:0.5}}>Đơn hàng đã hoàn tất hoặc đã được cho người khác</Text>
              </View>
            ) : (
              <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: appColors.white, borderRadius: 100, borderWidth: 0.2}}>
                <TextInput
                  ref={inputRef}
                  onChangeText={value => textRef.current = value}
                  placeholder='Nhắn tin'
                  style={{fontSize: hp(2.3), flex: 1, height: hp(5), paddingHorizontal: 20}}
                />
                <TouchableOpacity onPress={() => {handleSendImage()}} style={{marginRight: 10, padding: 10, borderRadius: 100, backgroundColor: appColors.gray5}}>
                  <Feather name="image" size={hp(2.7)} color={'#737373'}></Feather>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {handleSendMessage()}} style={{padding: 10, borderRadius: 100, backgroundColor: appColors.gray5}}>
                  <Feather name="send" size={hp(2.7)} color={'#737373'}></Feather>
                </TouchableOpacity>
              </View>
            )}
            </View>
        </View>
      </View>
    </ContainerComponent>
  )
}

export default ChatRoom

const styles = StyleSheet.create({})