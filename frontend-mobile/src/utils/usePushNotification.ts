import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import userAPI from '../apis/userApi'; // Adjust the import according to your project structure
import { NotificationModel } from '../models/NotificationModel';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export class usePushNotifications {
  static async registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        this.getExpoPushToken(pushTokenString);

      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }

  static getExpoPushToken = async (token: string) => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    if (!fcmtoken) {
      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        this.updateTokenForUser(token);
      }
    } else {
      this.updateTokenForUser(fcmtoken);
    }
  };

  static async updateTokenForUser(token: string) {
    const res = await AsyncStorage.getItem('auth');
    if (res) {
      const auth = JSON.parse(res);
      const { fcmTokens } = auth;
      if (fcmTokens && !fcmTokens.includes(token)) {
        await this.addUserToken(auth.id, token);
      }
    }
  }

  static async addUserToken(id: string, fcmToken: string) {
    try {
      await userAPI.HandleUser(
        '/add-fcmtoken',
        { userid: id, fcmtoken:  fcmToken},
        'post',
      );
    } catch (error) {
      console.log(`Cannot update tokens: ${error}`);
    }
  }

  static async removeUserToken(id: string, fcmToken: string) {
    try {
      await userAPI.HandleUser(
        '/remove-fcmtoken',
        { userid: id, fcmtoken:  fcmToken},
        'post',
      );
    } catch (error) {
      console.log(`Cannot update tokens: ${error}`);
    }
  }

  static async getUserTokens(id: string) {
    try {
      const {data} = await userAPI.HandleUser(
        `/get-fcmtokens?userid=${id}`
      );
      return data.fcmTokens;
    } catch (error) {
      console.log(`Cannot get user tokens: ${error}`);
    }
  }

  static async sendPushNotification(data: any) {
    const fcmtokens: any = await usePushNotifications.getUserTokens(data.userReceiverId);

    if (fcmtokens.length > 0) {
      fcmtokens.forEach(async (expoPushToken: any) => {
        const message = {
          to: expoPushToken,
          sound: "default",
          title: data.title,
          body: data.name ? `${data.name} ${data.body}` : `${data.body}`,
          data: { url: data.link }
        };
    
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      });
    }
  }
}
