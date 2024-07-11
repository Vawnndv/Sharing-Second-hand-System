import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from '../../navigators/AuthNavigator';
import MainNavigator from '../../navigators/MainNavigator';
import { addAuth, authSelector } from '../../redux/reducers/authReducers';
import * as Notifications from 'expo-notifications';
import { LoadingModal } from '../../modals';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const AppRouters = () => {
  const {getItem} = useAsyncStorage('auth');
  const [isLoading, setIsLoading] = useState(true); 

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigation: any  = useNavigation();

  // useEffect(() => {
  //   const handleNotificationResponse = (response: any) => {
  //     const url = response.notification.request.content.data.url;
  //     if (url) {
  //       const parts = url.split('/');
  //       if( parts[0] === 'order') {
  //         navigation.navigate('MyOrder', {
  //           screen: 'ViewDetailOrder',
  //           params: {
  //             orderid: parts[1]
  //           },
  //         });
  //       } else {
  //         navigation.navigate('Home', {
  //           screen: 'ItemDetailScreen',
  //           params: {
  //             postID: parts[1]
  //           },
  //         });
  //       }
  //       // Linking.openURL(`frontend-mobile://${url}`);
  //     }
  //   };

  //   const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

  //   return () => subscription.remove();
  // }, []);

  // useEffect(() => {
  //   const handleInitialNotification = async () => {
  //     const initialNotification = await Notifications.getLastNotificationResponseAsync();
  //     if (initialNotification) {
  //       console.log(initialNotification.notification.request.content.data, 'bcd');
  //       const url = initialNotification.notification.request.content.data.url;
  //       if (url) {
  //          const parts = url.split('/');
  //               if( parts[0] === 'order') {
  //                 navigation.navigate('MyOrder', {
  //                   screen: 'ViewDetailOrder',
  //                   params: {
  //                     orderid: parts[1]
  //                   },
  //                 });
  //               } else {
  //                 navigation.navigate('Home', {
  //                   screen: 'ItemDetailScreen',
  //                   params: {
  //                     postID: parts[1]
  //                   },
  //                 });
  //               }
  //         // Linking.openURL(`frontend-mobile://${url}`);
  //       }
  //     }
  //   };

  //   handleInitialNotification();
  // }, []);
  
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const res = await getItem();
    if (res) {
      dispatch(addAuth(JSON.parse(res)));
    }
    setIsLoading(false); 
  };

  return (
    <>
      {isLoading ? <LoadingModal visible={isLoading}/> : auth.accessToken ? <MainNavigator/> : <AuthNavigator />}
    </>
  )
}

export default AppRouters