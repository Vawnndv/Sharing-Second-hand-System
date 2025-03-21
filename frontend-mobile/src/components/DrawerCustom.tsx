import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home, Logout, User } from 'iconsax-react-native';
import React from 'react';
import { Button, FlatList, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { appColors } from '../constants/appColors';
import { authSelector, removeAuth } from '../redux/reducers/authReducers';
import AvatarComponent from './AvatarComponent';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import ButtonComponent from './ButtonComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { usePushNotifications } from '../utils/usePushNotification';
import authenticationAPI from '../apis/authApi';
import { removeUser } from '../redux/reducers/userReducers';

const DrawerCustom = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const size = 24;
  const color = appColors.black2;
  const profileMenu = [
    {
      key: 'Home',
      title: 'Trang chủ',
      icon: <Home size={size} color={color} />,
      
    },
    {
      key: 'MyPost',
      title: 'Bài đăng',
      icon: <AntDesign name="filetext1" size={size} color={color} />,
    },
    {
      key: 'MyOrder',
      title: 'Đơn hàng của bạn',
      icon: <AntDesign name="shoppingcart" size={size} color={color} />,
    },
    {
      key: 'History',
      title: 'Lịch sử giao dịch',
      icon: <MaterialCommunityIcons name="history" size={size} color={color} />,
    },
    {
      key: 'Notification',
      title: 'Thông báo',
      icon: <Ionicons name="notifications-outline" size={size} color={color} />,
    },
    {
      key: 'Chat',
      title: 'Tin nhắn',
      icon: <Ionicons name="chatbubble-outline" size={size} color={color} />,
    },
    {
      key: 'MyLike',
      title: 'Bài viết quan tâm',
      icon: <Ionicons name="heart-outline" size={size} color={color} />,
    },
    {
      key: 'MyProfile',
      title: 'Đổi mật khẩu',
      icon: <Ionicons name="settings-outline" size={size} color={color} />,
    },
    {
      key: 'Location',
      title: 'Vị trí',
      icon: <SimpleLineIcons name="location-pin" size={size} color={color} />,
    },
    {
      key: 'Contact',
      title: 'Liên hệ',
      icon: <AntDesign name="contacts" size={size} color={color} />,
    },
    {
      key: 'SignOut',
      title: 'Đăng xuất',
      icon: <AntDesign name="logout" size={size} color={color} />,
    },
  ];

  const handleLogout = async () => {
    try {
      const fcmtoken = await AsyncStorage.getItem('fcmtoken');

      if (fcmtoken) {
        if (auth.fcmTokens && auth.fcmTokens.length > 0 && !auth.fcmTokens.includes(fcmtoken)) {
          await usePushNotifications.removeUserToken(auth.id, fcmtoken);
        }
      }

      await authenticationAPI.HandleAuthentication(
        '/remove-refresh-token',
        { userid: auth.id, deviceid:  auth.deviceid},
        'post',
      );
      
      await AsyncStorage.clear();
      dispatch(removeAuth({}));
      dispatch(removeUser({}));
    } catch (error) {
      await AsyncStorage.clear();
      dispatch(removeAuth({}));
      dispatch(removeUser({}));
    }
  }

  const handleSettingAddress = () => {
    navigation.navigate('MapSettingAddressScreen',{useTo: 'setAddress'});
  }

  const handleNavigation = (key: string) => {
    switch (key) {
      case 'SignOut':
        handleLogout();
        break;

      case 'Location':
        handleSettingAddress();
        break;

      case 'Chat':
        navigation.navigate('Chat', {
          screen: 'ChatScreen',
          params: {
            isMenuNavigate: true
          },
        });
        break;

      default:
        navigation.navigate(key);
        break;
    }

    navigation.closeDrawer();
  };

  return (
    <View style={[localStyles.container]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <RowComponent 
        justify='flex-start'
        onPress={() => {
          navigation.closeDrawer('');
          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
            params: {
              id: auth.id
            },
          });
        }}
      >
        <AvatarComponent
          avatar={auth.avatar}
          username={auth.lastName ? auth.lastName : auth.email}
          styles={localStyles.avatar}
          size={60}
        />
        <SpaceComponent width={10} />
        <TextComponent styles={{marginTop: -8}} text={auth.firstName + ' ' + auth.lastName} title size={18} />
      </RowComponent>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        style={{
          flex: 1,
          // marginVertical: 16,
        }}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyles.listItem]}
            onPress={() => handleNavigation(item.key)}
          >
            {item.icon}
            <TextComponent
              text={item.title}
              styles={[localStyles.listItemText, {fontSize: 16, fontFamily: fontFamilies.medium}]}
            />
          </RowComponent>
        )}
      />
    </View>
  )
}

export default DrawerCustom

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    marginTop: 14,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginBottom :12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 15
  }
})