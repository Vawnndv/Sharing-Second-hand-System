import moment from 'moment';
import 'moment/locale/vi';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AvatarComponent, TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';
import { getRoomId, getRoomIdWithPost } from '../../utils/GetRoomID';
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { Timestamp, setDoc, doc, collection, addDoc, query, orderBy, onSnapshot, DocumentData, updateDoc, getDocs, limit, Firestore } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'

const ChatItem = ({item, route, navigation, noBorder}: any) => {
  moment.locale();
  const auth = useSelector(authSelector);
  const [lastMessage, setLastMessage] = useState<DocumentData | null | undefined>(undefined);

  const openChatRoom = ()=> {
    navigation.navigate('ChatRoomScreen', {
      item: item,
      postid: item?.postid
    });
  }


  useEffect(() => {

    let roomID = item.postid ? getRoomIdWithPost(auth?.id, item?.userid, item?.postid) : getRoomId(auth?.id, item?.userid);
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

  const updateRead = async () => {
    if (auth?.id == lastMessage?.userid)
      return
    try {
      let roomID = item.postid ? getRoomIdWithPost(auth?.id, item?.userid, item?.postid) : getRoomId(auth?.id, item?.userid);
      const docRef = doc(db, "rooms", roomID);
      const messageRef = collection(docRef, "messages");
  
      // Lấy tin nhắn cuối cùng từ bộ sưu tập "messages"
      const querySnapshot = await getDocs(query(messageRef, orderBy("createdAt", "desc"), limit(1)));
      let lastMessage: any = null; // Khai báo kiểu dữ liệu cho lastMessage
  
      querySnapshot.forEach((doc) => {
        lastMessage = doc;
      });
  
      // Kiểm tra xem có tin nhắn cuối cùng không
      if (lastMessage) {
        // Cập nhật trạng thái của tin nhắn mới nhất
        await updateDoc(lastMessage.ref, {
          isRead: true
        });
      }
    } catch(err) {
      console.error('Lỗi khi cập nhật trạng thái tin nhắn:', err);
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
      onPress={() => {
        updateRead()
        openChatRoom()
      }}
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
          <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: lastMessage?.isRead || auth?.id == lastMessage?.userid ? 0.5 : 1}}>
            {renderTime()}
          </Text>
        </View>
        {
          item?.postid &&
          <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.bold, fontStyle: lastMessage?.isRead  || auth?.id == lastMessage?.userid ? 'italic' : 'normal', opacity: lastMessage?.isRead || auth?.id == lastMessage?.userid ? 0.5 : 1}}>
              Đơn hàng: {item?.title}
          </Text>
        }
        <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: lastMessage?.isRead  || auth?.id == lastMessage?.userid ? 0.5 : 1 }}>
          {renderLastMessage()}
        </Text>
      </View>

    </TouchableOpacity>
  )
}

export default ChatItem

const styles = StyleSheet.create({})