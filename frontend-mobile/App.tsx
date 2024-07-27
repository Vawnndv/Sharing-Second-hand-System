import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic
} from '@expo-google-fonts/roboto';
import Entypo from '@expo/vector-icons/Entypo';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppRouters from './src/screens/auth/AppRouters';
import * as Linking from 'expo-linking';
import { appInfo } from './src/constants/appInfos';
import linking from './linking';
import axiosClient from './src/apis/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Keep the splash screen visible while we fetch resources
import * as Notifications from 'expo-notifications';

// const prefix = Linking.createURL('/');

SplashScreen.preventAutoHideAsync();

export default function App() {
  
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    const handleNotificationResponse = (response: any) => {
      const url = response.notification.request.content.data.url;
      if (url) {
        Linking.openURL(`frontend-mobile://${url}`);
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => subscription.remove();
  }, []);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      console.log(lastNotificationResponse.notification.request.content.data.url)
      Linking.openURL(`frontend-mobile://${lastNotificationResponse.notification.request.content.data.url}`);
    }
  }, [lastNotificationResponse]);

  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const count = useRef(0);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ...Entypo.font,
          Roboto_100Thin,
          Roboto_100Thin_Italic,
          Roboto_300Light,
          Roboto_300Light_Italic,
          Roboto_400Regular,
          Roboto_400Regular_Italic,
          Roboto_500Medium,
          Roboto_500Medium_Italic,
          Roboto_700Bold,
          Roboto_700Bold_Italic,
          Roboto_900Black,
          Roboto_900Black_Italic,
        });

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        // setFontsLoaded(true);
        setAppIsReady(true);
      }
    }
    prepare();

    // Xử lý tại đây khi ứng dụng được mở hoặc vào lại
    handleAppStateChange(AppState.currentState);

    // Đăng ký sự kiện để theo dõi thay đổi trạng thái của ứng dụng
    AppState.addEventListener('change', handleAppStateChange);

  }, []);

  

  const handleAppStateChange = async (currentState: string) => {
    // Kiểm tra trạng thái tiếp theo của ứng dụng (active, background, inactive)
    // Xử lý tương ứng với các trạng thái ứng dụng
    if (currentState === 'active') {
      if(count.current === 0){
        try {
          count.current += 1;
          const response = await axiosClient.post(`${appInfo.BASE_URL}/statistic/insertAnalytic`,{
            type: 'access'
          })
        } catch (error) {
          console.log(error)
        }
      }
    } 
    
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <NavigationContainer 
          onReady={onLayoutRootView}
          linking={linking}
        >
          <AppRouters />
        </NavigationContainer>
      </Provider>
    </>
  );
}

registerRootComponent(App);

