import { View, Text, StyleSheet, Platform, StatusBar, Touchable, Image, FlatList } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { appColors } from '../constants/appColors';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import { globalStyles } from '../styles/globalStyles';
import { CardTick, Home, Information, ShoppingCart, Timer, User } from 'iconsax-react-native';
import { AntDesign, Feather, FontAwesome6, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

const DrawerCustom = ({navigation}: any) => {
  const user =  {
    name: 'Nguyen Dinh Van',
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww",
  };
  const size = 24
  const color = appColors.gray;
  const profileMenu = [
    {
      key: 'Home',
      title: 'Trang chủ',
      icon: <Home size={size} color={color} />,
      
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
      key: 'MyHeart',
      title: 'Bài viết đã thích',
      icon: <Ionicons name="heart-outline" size={size} color={color} />,
    },
    {
      key: 'MyProfile',
      title: 'Thông tin tài khoản',
      icon: <User size={size} color={color} />,
    },
    {
      key: 'Setting',
      title: 'Cài đặt',
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
      key: 'Help',
      title: 'Trợ giúp',
      icon: <Feather name="help-circle" size={size} color={color} />,
    },
  ];

  const handleSignOut = () => {

  }

  return (
    <View style={[localStyles.container]}>
      <RowComponent 
        justify="space-between"
        onPress={() => {
          navigation.closeDrawer('');
          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
            // params: {},
          });
        }}
      >
        {user.imageUrl ? (
          <Image source={{uri: user.imageUrl}} style={[localStyles.avatar]} />
        ) : (
          <View style={[
            localStyles.avatar,
            {
              backgroundColor :appColors.gray2
            }
          ]}>
            <TextComponent
              title
              size={22}
              color={appColors.white}
              text={
                user.name
                  ? user.name.split(' ')[user.name.split(' ').length - 1].substring(0,1)
                  : ''
              }
            />
          </View>
        )}
        <TextComponent text={user.name} title size={20} />
      </RowComponent>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        style={{
          flex: 1,
          marginVertical: 16,
        }}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyles.listItem]}
            onPress={
              item.key === 'SignOut'
                ? () => handleSignOut()
                : () => {
                  console.log(item.key);
                  navigation.closeDrawer();
                }
              }
          >
            {item.icon}
            <TextComponent
              text={item.title}
              styles={[localStyles.listItemText, {fontSize: 16}]}
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
    paddingVertical: 14,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  }
})