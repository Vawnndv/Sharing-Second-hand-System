import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import queryString from "query-string";
import { Platform, ToastAndroid } from "react-native";
import { appInfo } from "../constants/appInfos";
import { removeAuth, updateAuth } from "../redux/reducers/authReducers";
import store from "../redux/store";
import { removeUser } from "../redux/reducers/userReducers";

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  } else {
    // For iOS or other platforms, you can handle differently if needed
    alert(message);
  }
}

const handleLogout = async () => {
  try {
    const dispatch = store.dispatch;
    const state = store.getState();
    const auth = state.authReducer.authData;
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');

    if (fcmtoken) {
      if (auth.fcmTokens && auth.fcmTokens.length > 0 && !auth.fcmTokens.includes(fcmtoken)) {
        await axios.post(`${appInfo.BASE_URL}/auth/remove-fcmtoken`, {
          userid: auth.id, fcmtoken
        })
      }
    }

    await axios.post(`${appInfo.BASE_URL}/auth/remove-refresh-token`, { 
      userid: auth.id, deviceid:  auth.deviceid
    });

    await AsyncStorage.clear();

    dispatch(removeAuth({}));
    dispatch(removeUser({}));
  } catch (error) {
     await AsyncStorage.clear();
    console.log(`Logout error: ${error}`);
  }
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
  response => {
    if (response.data && (response.status === 200 || response.status === 201)) {
      return response.data;
    }
    throw new Error('Error');
  },
  async error => {
    const originalRequest = error.config;
    
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.status === 403 && error.response.data.message === 'Not authorized, invalid token') {
        try {
          const dispatch = store.dispatch;
          // const state = store.getState();
          const storage = await AsyncStorage.getItem('auth');
          const auth = storage ? JSON.parse(storage) : null;

          if (auth === null) {
            showToast('Yêu cầu đăng nhập');
            return;
          }
          const res: any = await axiosClient.post(`${appInfo.BASE_URL}/auth/refresh-token`, {
            userid: auth.id, deviceid: auth.deviceid
          });
          if (res.accessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${res.accessToken}`;
            await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, accessToken: res.accessToken }));
            dispatch(updateAuth({accessToken: res.accessToken}));
            
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          await handleLogout();
          showToast('Phiên đăng nhập đã hết hạn');
        }
      } else if (error.response.status === 403 && error.response.data.message === 'Tài khoản của bạn đã bị khóa') {
        handleLogout();
        showToast(error.response.data.message);
      } else if (error.response.status === 403 && error.response.data.message === 'Not authorized, no token') {
        showToast('Yêu cầu đăng nhập');
      }
      else {
        // return Promise.reject(new Error(error.response.data.message));
        throw new Error(error.response.data.message);
      }
    } else {
      // throw new Error(error.response.data.message);
      throw new Error('Lỗi mạng');
    }
  }
);

export default axiosClient