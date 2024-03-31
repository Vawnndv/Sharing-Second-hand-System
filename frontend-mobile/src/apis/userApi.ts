import axiosClient from "./axiosClient"

class AuthAPI {
  HandleUser = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete'
  ) => {
    return await axiosClient(`/users${url}`, {
      method: method ?? 'get',
      data,
    });
  };
};

const HandleUser = new AuthAPI();
export default HandleUser;