import Axios from '../APIs/Axios';

export interface AuthData {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  avatar: string;
  id: string;
  token: string;
  isAdmin: boolean;
  roleID: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  accessToken: string;
  dob: string;
  deviceid: string;
}

// Login user API
const loginService = async (user: AuthData): Promise<any> => {
  const {data} = await Axios.post('/auth/login', {...user, platform: 'web'});
  
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  return data;
};

// Forgot password API
const forgotPasswordService = async (email: string) => {
    const data = await Axios.post('/auth/forgotPassword', {email})
    return data;
}

const logoutService = async (): Promise<void> => {
  const authString = localStorage.getItem('userInfo');
  const auth: UserInfo | null = authString ? JSON.parse(authString) : null;

  if (auth) {
    await Axios.post(`/auth/remove-refresh-token`, { 
      userid: auth.id, 
      deviceid: auth.deviceid 
    });
  }
};

export { loginService, logoutService, forgotPasswordService };
