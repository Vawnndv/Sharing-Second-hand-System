import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Clock } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { AvatarComponent, ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { NotificationModel } from '../../models/NotificationModel';
import { doc, collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, getDocs, getDoc, writeBatch } from 'firebase/firestore';
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
import { Platform, ToastAndroid } from "react-native";

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0, // xOffset
      50  // yOffset
    );
  } else {
    // For iOS or other platforms, you can handle differently if needed
    alert(message);
  }
};

const NotificationScreen = () => {
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState('');
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

      const docSnap = await getDoc(docRef);
  
      // Check if the document exists and has isRead as false
      if (docSnap.exists() && !docSnap.data().isRead) {
        // Update the read count if the notification was previously unread
        await updateDoc(docRef, { isRead: true });
        
        setReadCount(readCount - 1);
      }
    } catch (err) {
      console.error('Error updating notification:', err);
    }
  };

  const updateAllRead = async () => {
    setIsLoading(true);
    const batch = writeBatch(db);

    try {
      // Iterate through notificationList and add update operations to the batch
      notificationList.forEach(notification => {
        if (!notification.isRead) {
          const docRef = doc(db, "receivers", auth.id.toString(), "notification", notification.id);
          batch.update(docRef, { isRead: true });
        }
      });

      // Commit the batch
      await batch.commit();

      // Update the state only after all updates are completed
      setNotificationList(prevList => 
        prevList.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
      setReadCount(0);
    } catch (err) {
      console.error('Error updating notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onDeletePressed = async (id: string) => {
    try {
      setIsLoadingDelete(id);
      const docRef = doc(db, "receivers", auth.id.toString(), "notification", id);
  
      // Get the document snapshot from Firestore
      const docSnap = await getDoc(docRef);
  
      // Check if the document exists and has isRead as false
      if (docSnap.exists() && !docSnap.data().isRead) {
        // Update the read count if the notification was previously unread
        setReadCount(readCount - 1);
      }
  
      // Delete the document
      await deleteDoc(docRef);
      showToast('Đã xóa')
      setIsLoadingDelete('');
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  

  return (
    <ContainerComponent 
      back 
      title='Thông báo' 
      badge={readCount} 
      option={
        notificationList.filter(element => !element.isRead).length > 0 && (
          <ButtonComponent
            onPress={updateAllRead}
            icon={
              
              <Feather name="check-square" size={20} color={appColors.text} />
            }
          />
        )
      }
    >
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : notificationList.length === 0 ? (
        <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../../../assets/images/shopping.png')}
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      ) : (
        <FlatList
          data={notificationList}
          renderItem={({ item, index }) => (
            <NotificationItem
              item={item}
              index={index}
              isLoadingDelete={isLoadingDelete}
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

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})