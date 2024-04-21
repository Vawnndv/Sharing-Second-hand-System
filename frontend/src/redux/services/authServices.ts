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
  roleId: number;
  firstName: string;
  lastName: string;
}

// Login user API
const loginService = async (user: AuthData): Promise<any> => {
  const { data } = await Axios.post('/auth/login', {...user, platform: 'web'});

  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  return data;
};

// Forgot password API
const forgotPasswordService = async (email: string) => {
    const { data } = await Axios.post('/auth/forgot', {email})
    return data
}

const logoutService = async (): Promise<any> => {
  await Axios.post('/auth/logout', {}, { withCredentials: true });
};

export { loginService, logoutService, forgotPasswordService };
