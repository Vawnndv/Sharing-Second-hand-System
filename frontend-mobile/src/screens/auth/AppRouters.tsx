import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from '../../navigators/AuthNavigator';
import MainNavigator from '../../navigators/MainNavigator';
import { addAuth, authSelector } from '../../redux/reducers/authReducers';
import * as Notifications from 'expo-notifications';
import { LoadingModal } from '../../modals';
import { useNavigation } from '@react-navigation/native';

const AppRouters = () => {
  const {getItem} = useAsyncStorage('auth');
  const [isLoading, setIsLoading] = useState(true); 

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigation: any  = useNavigation();

  
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        // Linking.openURL(`frontend-mobile://${url}`)
        const parts = url.split('/');
        if( parts[0] === 'order') {
          navigation.navigate('MyOrder', {
            screen: 'ViewDetailOrder',
            params: {
              orderid: parts[1]
            },
          });
        } else {
          navigation.navigate('Home', {
            screen: 'ItemDetailScreen',
            params: {
              postID: parts[1]
            },
          });
        }
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove(); // Hủy bỏ listener khi component bị unmount
    };
  }, []); 
  
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