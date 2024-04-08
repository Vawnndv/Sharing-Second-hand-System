import axiosClient from "./axiosClient"

class UserAPI {
  HandleUser = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete'
  ) => {
    console.log(url, data);
    return await axiosClient(`/user${url}`, {
      method: method ?? 'get',
      data,
    });
  };
};

const userAPI = new UserAPI();
export default userAPI;