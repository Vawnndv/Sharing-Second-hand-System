import axios from "axios";
import queryString from "query-string";
import { appInfo } from "../constants/appInfos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../redux/reducers/authReducers";
import { usePushNotifications } from "../utils/usePushNotification";
import store from "../redux/store";
import { Platform, ToastAndroid } from "react-native";


const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  } else {
    // For iOS or other platforms, you can handle differently if needed
    alert(message);
  }
}

const handleLogout = async () => {
  
  const state = store.getState();
  const auth = state.authReducer.authData;
  const dispatch = store.dispatch;

  const fcmtoken = await AsyncStorage.getItem('fcmtoken');

  if (fcmtoken) {
    if (auth.fcmTokens && auth.fcmTokens.length > 0 && !auth.fcmTokens.includes(fcmtoken)) {
      await axios.post(`${appInfo.BASE_URL}/user/remove-fcmtoken`, {
        userid: auth.id, fcmtoken
      })
    }
  }

  const hello = await AsyncStorage.getItem('auth');

  await AsyncStorage.clear();

  const hello2 = await AsyncStorage.getItem('auth');
  dispatch(removeAuth({}));
};


const getAccessToken = async () => {
  const res = await AsyncStorage.getItem('auth');

  return res ? JSON.parse(res).accessToken : '';
};

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = await getAccessToken();

  config.headers = {
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;
  return config;
});

axiosClient.interceptors.response.use(
  res => {
    if (res.data && (res.status === 200 || res.status === 201)) {
      return res.data;
    }
   
    throw new Error('Error');
  },
  error => {

    // console.log(`Error api ${JSON.stringify(error)}`);
    // throw new Error(error.response);
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.status === 403 && error.response.data.message === 'Not authorized, invalid token') {
        handleLogout();
        showToast('Phiên đăng nhập đã hết hạn');
      }
      else if (error.response.status === 403 && error.response.data.message === 'Tài khoản của bạn đã bị khóa') {
        handleLogout();
        showToast(error.response.data.message);
      } else {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error('Network Error');
    }
  },
);

export default axiosClient