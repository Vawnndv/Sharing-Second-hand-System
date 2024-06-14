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

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "receivers", auth.id.toString());
    const messagesRef = collection(docRef, "notification");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot)=> {
      const list: any = snapshot.docs.map(doc=>{
        return doc.data();      
      })

      setNotificationList(list);
      console.log(notificationList)
      setIsLoading(false);
    })
  }, []);

  const updateRead = async (id: string) => {
    try {
        const docRef = doc(db, "receivers", auth.id.toString(), "notification", id);
        
        // Update the document
        await updateDoc(docRef, {
            isRead: true
        });
        console.log(`Notification with id ${id} has been marked as read`);
    } catch(err) {
        console.error('Error updating notification:', err);
    }
};

  const onDeletePressed = async (id: string) => {
    try {
        // Reference to the specific notification document using its ID
        const docRef = doc(db, "receivers", auth.id.toString(), "notification", id);

        // Delete the document
        await deleteDoc(docRef);
        console.log(`Notification with id ${id} has been deleted`);
    } catch (err) {
        console.error('Error deleting notification:', err);
    }
  };
  
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

