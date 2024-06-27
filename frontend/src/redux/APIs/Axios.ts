/* eslint-disable consistent-return */
import axios from 'axios';
import { store } from '../store';
import { logoutAction, updateUserInfoAction } from '../actions/authActions';
import toast from 'react-hot-toast';

const getAccessToken = async () => {
  const res = localStorage.getItem('userInfo');

  return res ? JSON.parse(res).accessToken : '';
};

const handleLogout = async () => {
  // const currentState = store.getState()
  // Access the userLogin slice from the state
  // const userLoginState = currentState.userLogin
  // Accessing userInfo within userLogin
  // const userInfo = userLoginState.userInfo

  store.dispatch(logoutAction());

};

const Axios = axios.create({
  baseURL: process.env.BASE_URL
});

Axios.interceptors.request.use(async (config: any) => {
  console.log(process.env.BASE_URL);

  const accesstoken = await getAccessToken();

  config.headers = {
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  config.data;
  return config;
});

Axios.interceptors.response.use(
  res => {
    if (res.data && (res.status === 200 || res.status === 201)) {
      return res.data;
    }
    throw new Error('Error');
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.status === 403 && error.response.data.message === 'Not authorized, invalid token') {
        try {
          const currentState = store.getState();
          const auth = currentState.userLogin?.userInfo;

          if (!auth) {
            throw new Error('User not authenticated');
          }

          const res: any = await Axios.post(`/auth/refresh-token`, {
            userid: auth.id,
            deviceid: auth.deviceid
          });
          if (res.accessToken) {
            console.log(res.accessToken);

            const refreshUser = {
              ...auth,
              accessToken: res.accessToken
            }
            // originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
            
            // eslint-disable-next-line @typescript-eslint/dot-notation
            originalRequest.headers['Authorization'] = `Bearer ${res.accessToken}`;

            localStorage.setItem('userInfo', JSON.stringify(refreshUser));
            
            store.dispatch(updateUserInfoAction(refreshUser))

            // eslint-disable-next-line @typescript-eslint/return-await
            return await Axios(originalRequest);
          }
        } catch (refreshError) {
          console.log(refreshError)
          await handleLogout();
          toast.error('Phiên đăng nhập đã hết hạn');
        }
      } else if (error.response.status === 403 && error.response.data.message === 'Tài khoản của bạn đã bị khóa') {
        handleLogout();
        toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin qua email để xử lý')
      } else {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error('Network Error');
    }
  },
);

export default Axios;
