import { MaterialIcons } from '@expo/vector-icons';
import { Clock } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { AvatarComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { NotificationModel } from '../../models/NotificationModel';
import { doc, collection, query, orderBy, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { db } from '../../../firebaseConfig';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import LoadingComponent from '../../components/LoadingComponent';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NotificationItem from './component/NotificationItem';

const NotificationScreen = () => {
  const auth = useSelector(authSelector);
  console.log(auth.id);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationModel[]>([]);
  const [readCount, setReadCount] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "receivers", auth.id.toString());
    const messagesRef = collection(docRef, "notification");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as NotificationModel);

      // Calculate the number of unread notifications
      const readNotificationsCount = list.reduce((count, notification) => {
        return !notification.isRead ? count + 1 : count;
      }, 0);

      setNotificationList(list);
      setReadCount(readNotificationsCount);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateRead = async (id: string) => {
    try {
      const docRef = doc(db, "receivers", auth.id.toString(), "notification", id);

      // Find the notification in the current list
      const notification = notificationList.find(notification => notification.id === id);

      if (notification && !notification.isRead) {
        // Update the document
        await updateDoc(docRef, { isRead: true });
        
        // Update the read count if the notification was previously unread
        setReadCount(readCount - 1);
        
        console.log(`Notification with id ${id} has been marked as read`);
      }
    } catch (err) {
      console.error('Error updating notification:', err);
    }
  };

  const onDeletePressed = async (id: string) => {
    try {
      const docRef = doc(db, "receivers", auth.id.toString(), "notification", id);

      // Find the notification in the current list
      const notification = notificationList.find(notification => notification.id === id);

      if (notification && !notification.isRead) {
        // Update the read count if the notification was previously unread
        setReadCount(readCount - 1);
      }

      // Delete the document
      await deleteDoc(docRef);
      
      console.log(`Notification with id ${id} has been deleted`);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <ContainerComponent back title='Thông báo' badge={readCount}>
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <FlatList
          data={notificationList}
          renderItem={({ item, index }) => (
            <NotificationItem
              item={item}
              index={index}
              onDeletePressed={onDeletePressed}
              updateRead={updateRead}
            />
          )}
        />
      )}
    </ContainerComponent>
  );
};

export default NotificationScreen;
