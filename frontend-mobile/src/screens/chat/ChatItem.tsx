import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AvatarComponent, TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';
import { getRoomId } from '../../utils/GetRoomID';
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import moment from 'moment';
import 'moment/locale/vi';

const ChatItem = ({item, route, navigation, noBorder}: any) => {
  moment.locale();
  const auth = useSelector(authSelector);
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const openChatRoom = ()=> {
    navigation.navigate('ChatRoomScreen', {
      item: item,
    });
  }


  useEffect(() => {

    let roomID = getRoomId(auth?.id, item?.userid);
    const docRef = doc(db, "rooms", roomID);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    let unsub = onSnapshot(q, (snapshot)=> {
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      })
      setLastMessage(allMessages[0] ? allMessages[0] : null)
    })

  }, [])

  const renderTime = () =>{
    if (lastMessage) {
      const milliseconds = lastMessage?.createdAt.seconds * 1000 + lastMessage?.createdAt.nanoseconds / 1000000;
      return moment(milliseconds).fromNow()
    } else {
      return ''
    }
  }

  const renderLastMessage = () =>{
    if (lastMessage === undefined)
      return 'Loading...';
    if (lastMessage) {
      let mess = lastMessage?.text
      if (lastMessage.type == 'image')
        mess = "Đã gửi ảnh"
      if(auth?.id == lastMessage.userid)
        return "You: " + mess;
      return mess;
    } else {
      return 'Gửi lời chào 👋'
    }
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 20,
        marginHorizontal: 20,
        marginBottom: 4,
        paddingBottom: 2,
        // borderBottomWidth: noBorder ? 0 : 0.5
      }}
      onPress={openChatRoom}
    >
      {/* <Image
        source={{uri: item?.avatar}}
        style={{height: hp(9), width: hp(9), borderRadius: 100}}
      /> */}
      <AvatarComponent 
          avatar={item?.avatar}
          username={item?.username ? item?.username : item?.firstname + ' ' + item?.lastname}
          styles={{height: hp(9), width: hp(9), borderRadius: 100}}
        />

      {/* Name and last message */}
      <View style={{flex: 1, gap: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: hp(2), fontFamily: fontFamilies.bold}}>{item?.firstname} {item?.lastname}</Text>
          <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: 0.5}}>
            {renderTime()}
          </Text>
        </View>
        <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: 0.5}}>
          {renderLastMessage()}
        </Text>
      </View>

    </TouchableOpacity>
  )
}

export default ChatItem

const styles = StyleSheet.create({})