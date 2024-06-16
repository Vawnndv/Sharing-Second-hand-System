import axios from 'axios';
import { UserInfo } from '../services/authServices';

const getAccessToken = async () => {
  const res = localStorage.getItem('userInfo');

  return res ? JSON.parse(res).accessToken : '';
};
const Axios = axios.create({
  baseURL: 'http://localhost:3000'
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
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  },
);

export default Axios;
