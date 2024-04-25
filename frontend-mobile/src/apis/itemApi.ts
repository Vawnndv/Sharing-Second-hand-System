import axiosClient from "./axiosClient"

class itemAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete'
  ) => {
    return await axiosClient(`/items${url}`, {
      method: method ?? 'get',
      data,
    });
  };
};

const itemsAPI = new itemAPI();
export default itemsAPI;