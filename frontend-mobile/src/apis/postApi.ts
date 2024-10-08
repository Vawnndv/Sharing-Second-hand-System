import axiosClient from "./axiosClient"

class postAPI {
  HandlePost = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete'
  ) => {
    return await axiosClient(`/posts${url}`, {
      method: method ?? 'get',
      data,
    });
  };
};

const postsAPI = new postAPI();
export default postsAPI;