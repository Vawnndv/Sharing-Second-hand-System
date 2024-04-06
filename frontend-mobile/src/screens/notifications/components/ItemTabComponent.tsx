import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllNotifComponent from './AllNotifComponent';
import UnreadNotifComponent from './UnreadNotifComponent';
import { NotificationModel } from '../../../models/NotificationModel';

const itemList: NotificationModel[] = [
  {
    name: 'Văn',
    avatar: '',
    link: '',
    content: 'đã quyết định cho bạn những món đồ của cô ấy. Nhấp vào để xem thông tin chi tiết về bài đăng',
    time: '2 phút trước'
  },
  {
    name: 'Tấn',
    avatar: '',
    link: '',
    content: 'đã thực hiện yêu cầu cho đồ vào kho, hãy cố gắng đợi phản hồi từ admin, chúng tôi sẽ phản hồi sớm nhất có thể!',
    time: '2 phút trước'
  },
  {
    name: 'Kho số 1',
    avatar: '',
    link: '',
    content: 'đã hoàn tất quá trình cho đồ vào kho của bạn. Nhấp vào để xem thông tin chi tiết!',
    time: '2 phút trước'
  },
  {
    name: 'Cường',
    avatar: '',
    link: '',
    content: 'đã quyết định cho bạn những món đồ của cô ấy. Nhấp vào để xem thông tin chi tiết về bài đăng',
    time: '2 phút trước'
  },
  {
    name: 'Văn',
    avatar: '',
    link: '',
    content: 'đã quyết định cho bạn những món đồ của cô ấy. Nhấp vào để xem thông tin chi tiết về bài đăng',
    time: '2 phút trước'
  },
  {
    name: 'Văn',
    avatar: '',
    link: '',
    content: 'đã quyết định cho bạn những món đồ của cô ấy. Nhấp vào để xem thông tin chi tiết về bài đăng',
    time: '2 phút trước'
  },
]

const itemList2: NotificationModel[] = [
  {
    name: 'Văn',
    avatar: '',
    link: '',
    content: 'đã quyết định cho bạn những món đồ của cô ấy. Nhấp vào để xem thông tin chi tiết về bài đăng',
    time: '2 phút trước'
  },
  {
    name: 'Tấn',
    avatar: '',
    link: '',
    content: 'đã thực hiện yêu cầu cho đồ vào kho, hãy cố gắng đợi phản hồi từ admin, chúng tôi sẽ phản hồi sớm nhất có thể!',
    time: '2 phút trước'
  },
]

const ItemTabComponent = () => {
  const SubTabs = createMaterialTopTabNavigator();
  return (
    <SubTabs.Navigator style={styles.tabs}>
      <SubTabs.Screen
        name="Tất cả"
        component={AllNotifComponent}
        initialParams={{ itemList }}
        options={{
          tabBarLabel: 'Tất cả',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
      <SubTabs.Screen
        name="Chưa đọc"
        component={UnreadNotifComponent}
        initialParams={{ itemList2 }}
        options={{
          tabBarLabel: 'Chưa đọc',
          tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
          tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
          tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
        }}
      />
    </SubTabs.Navigator>
  );
}

export default ItemTabComponent;
  
const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  tabItem: {
    width: '60%',
    backgroundColor: 'transparent',
  },

  tabLabel: {
    textTransform: 'capitalize',
    color: '#552466',
    fontWeight:'bold',
    fontSize: 17,
  },

  tabIndicator: {
    backgroundColor: '#552466',
    height: 3,
  },
});