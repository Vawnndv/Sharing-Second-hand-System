import { useNavigation } from '@react-navigation/native'
import { HambergerMenu, Location } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { appColors } from '../constants/appColors'
import RowComponent from './RowComponent'
import SpaceComponent from './SpaceComponent'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/authReducers'


const HeaderComponent = () => {
  const navigation: any = useNavigation();

  const auth = useSelector(authSelector);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  useEffect(() => {
    // Thiết lập listener và lưu hàm hủy đăng ký
    const unsubscribe = countUnreadNotifications(auth.id.toString(), (count) => {
      setUnreadNotificationCount(count);
    });

    // Hủy đăng ký listener khi component unmount
    return () => unsubscribe();
  }, [auth.id]);

  // Hàm đếm số lượng tài liệu trong sub-collection "notification" của collection "receivers" với điều kiện isRead là false
  const countUnreadNotifications = (receiverId: string, callback: (count: number) => void) => {
    const docRef = doc(db, "receivers", receiverId);
    const notificationsRef = collection(docRef, "notification");

    // Tạo query với điều kiện isRead là false
    const q = query(notificationsRef, where("isRead", "==", false));

    // Thiết lập listener để lắng nghe các thay đổi
    const unsubscribe = onSnapshot(q, (snapshot: { size: number }) => {
      const count = snapshot.size;
      callback(count);
    });

    return unsubscribe;
  };

  return (
    <RowComponent justify='flex-end' styles={{flex: 1}}>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <Ionicons name="notifications-outline" size={26} color={appColors.black} />
        {unreadNotificationCount > 0 && (
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 100,
              borderWidth: 2,
              borderColor: appColors.white,
              position: 'absolute',
              top: 0,
              right: 0,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
        <Ionicons name="search-outline" size={26} color={appColors.black} />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.navigate('MapSettingAddressScreen',{useTo: 'setAddress'})}>
        <Ionicons name="location-outline" size={26} color={appColors.black} />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={30} color={appColors.black} />
      </TouchableOpacity>
    </RowComponent>
  )
}

export default HeaderComponent