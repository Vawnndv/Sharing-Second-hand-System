import axios from 'axios';
import { store } from '../store';
import { logoutAction } from '../actions/authActions';
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
  toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin qua email để xử lý')

};

const Axios = axios.create({
  baseURL: process.env.BASE_URL
});

Axios.interceptors.request.use(async (config: any) => {
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
  error => {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.status === 403 && error.response.data.message === 'Tài khoản của bạn đã bị khóa') {
        handleLogout();
      }
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  },
);

export default Axios;
