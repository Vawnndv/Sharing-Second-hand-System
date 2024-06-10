import { MaterialIcons } from '@expo/vector-icons'
import { Clock } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { AvatarComponent, ContainerComponent, RowComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { fontFamilies } from '../../constants/fontFamilies'
import { globalStyles } from '../../styles/globalStyles'
import { NotificationModel } from '../../models/NotificationModel'
import { doc, collection, query, orderBy, onSnapshot, DocumentData, getDocs, limit, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { db } from '../../../firebaseConfig'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import LoadingComponent from '../../components/LoadingComponent'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NotificationItem from './component/NotificationItem'


const NotificationScreen = () => {
  const auth = useSelector(authSelector);
  console.log(auth.id)
  const [isLoading, setIsLoading] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationModel[]>([]);

  const updateRead = async (notificationCurrent: NotificationModel) => {
    try {
      console.log(notificationCurrent, 'aaaaaaaaaaaaaaaaaaaa');
      const docRef = doc(db, "receivers", auth.id.toString());
      const messageRef = collection(docRef, "notification");
  
      // Lấy tin nhắn cuối cùng từ bộ sưu tập "messages"
      const querySnapshot = await getDocs(query(messageRef));
      let notificationItem: any = null; // Khai báo kiểu dữ liệu cho lastMessage
  
      querySnapshot.forEach((doc) => {
        if (JSON.stringify(doc.data()) === JSON.stringify(notificationCurrent)) {
          console.log(doc.data(), notificationCurrent, '1233123123')
          notificationItem = doc
        }
      });

      if (notificationItem) {

        await updateDoc(notificationItem.ref, {
          isRead: true
        });
        notificationItem = null
      }
    } catch(err) {
      console.error('Lỗi khi cập nhật trạng thái tin nhắn:', err);
    }
  }


  const onDeletePressed = async (notificationCurrent: NotificationModel) => {
    try {
      const notificationRef = collection(db, "receivers", auth.id.toString(), "notification");
      const q = query(notificationRef);
  
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (docSnapshot) => {
        if (JSON.stringify(docSnapshot.data()) === JSON.stringify(notificationCurrent)) {
          await deleteDoc(docSnapshot.ref);
          console.log(`Notification with postid ${notificationCurrent.postid} has been deleted`);
        }
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  

// Usage example
// deleteNotification('specific-post-id');

    
  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "receivers", auth.id.toString());
    const messagesRef = collection(docRef, "notification");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot)=> {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const list: any = snapshot.docs.map(doc=>{
        return doc.data();      
      })

      setNotificationList(list);
      console.log(notificationList)
      setIsLoading(false);
    })
  }, []);
  
  return (
    <ContainerComponent back title='Thông báo'>
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <FlatList
          data={notificationList}
          renderItem={({item, index}) => (
            <NotificationItem item={item} index={index} onDeletePressed={onDeletePressed} updateRead={updateRead}/>
          )}
        />
      )}
    </ContainerComponent>
  )
}

export default NotificationScreen

