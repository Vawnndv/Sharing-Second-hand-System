import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:3000'
});

axios.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: '',
    Accept: 'application/json',
    ...config.headers
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  config.data
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
    // console.log(`Error api ${JSON.stringify(error)}`);
    // throw new Error(error.response);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  },
);


export default Axios;
