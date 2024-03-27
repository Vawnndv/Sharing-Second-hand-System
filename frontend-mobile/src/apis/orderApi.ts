import axiosClient from "./axiosClient"

class OrderAPI {
  HandleOrder = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete'
  ) => {
    return await axiosClient(`/order${url}`, {
      method: method ?? 'get',
      data,
    });
  };
};

const orderAPI = new OrderAPI();
export default orderAPI;