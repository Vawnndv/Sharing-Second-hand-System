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
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppRouters from './src/screens/auth/AppRouters';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { appInfo } from './src/constants/appInfos';
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const config = {
  screens: {
    // NotFound: '*',
    // SearchScreen: {
    //   path: 'searchscreen',
    //   screens: {
    //     Search: 'search'
    //   }
    // },
    // ItemDetailScreen: {path: 'detail/:postID', parse: {
    //   postID: (postID: string) => `${postID}`,
    // }},
    Main: {
      path: '',
      screens: {
        TabNavigator: {
          path: '',
          screens: {
            Home: {
              path: 'post',
              screens: {
                ItemDetailScreen: {
                  path: 'detail/:postID',
                  parse: {
                    postID: (postID: string) => `${postID}`,
                  },
                }
              }
            },
          },
        },
        MyProfile: 'profile',
        MyOrder: {
          path: 'order',
          screens: {
            ViewDetailOrder: {
              path: 'detail/:orderid',
              parse: {
                orderid: (orderid: string) => `${orderid}`,
              },
            }
          }
        }
      },
    },
  }
};

const prefix = Linking.createURL('/');

export default function App() {
  
  const [appIsReady, setAppIsReady] = useState(false);
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

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      Linking.openURL(url);
    });
    return () => subscription.remove();
  }, []);
  

  const handleAppStateChange = async (currentState: string) => {
    // Kiểm tra trạng thái tiếp theo của ứng dụng (active, background, inactive)
    console.log('App State:', currentState);
    console.log(count.current,count.current)
    // Xử lý tương ứng với các trạng thái ứng dụng
    if (currentState === 'active') {
      if(count.current === 0){
        try {
          count.current += 1;
          const response = await axios.post(`${appInfo.BASE_URL}/statistic/insertAnalytic`,{
            type: 'access'
          })
          // console.log("Response ACCESSSSSSS", response)
        } catch (error) {
          console.log(error)
        }
      }
    } 
    
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
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
          linking={{
            prefixes: ['frontend-mobile://'],
            config
          }}
        >
          <AppRouters />
        </NavigationContainer>
      </Provider>
    </>
  );
}

registerRootComponent(App);


// import { Button, Platform, Text, View } from "react-native";
// import { useState, useEffect } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState("");

//   useEffect(() => {
//     console.log("Registering for push notifications...");
//     registerForPushNotificationsAsync()
//       .then((token: any) => {
//         console.log("token: ", token);
//         setExpoPushToken(token);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   async function registerForPushNotificationsAsync() {
//     let token;

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }

//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== "granted") {
//         alert("Failed to get push token for push notification!");
//         return;
//       }
//       // Learn more about projectId:
//       // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//       token = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId: "3d1b1f78-a4b7-4ba8-9f74-8d08fdc8185d",
//         })
//       ).data;
//       console.log(token);
//     } else {
//       alert("Must use physical device for Push Notifications");
//     }

//     return token;
//   }

//   const sendNotification = async () => {
//     console.log("Sending push notification...");

//     // notification message
//     const message = {
//       to: expoPushToken,
//       sound: "default",
//       title: "My first push notification!",
//       body: "This is my first push notification made with expo rn app",
//     };

//     await fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         host: "exp.host",
//         accept: "application/json",
//         "accept-encoding": "gzip, deflate",
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(message),
//     });
//   };

//   return (
//     <View style={{ marginTop: 100, alignItems: "center" }}>
//       <Text style={{ marginVertical: 30 }}>Expo RN Push Notifications</Text>
//       <Button title="Send push notification" onPress={sendNotification} />
//     </View>
//   );
// }
