import Axios from '../APIs/Axios';

// Change password API
const changePasswordService = async (password: string): Promise<any>  => {
  const { data } = await Axios.put('/user/change-password', password)
  return data
}

// update profile API call
const updateProfileService = async (user: any): Promise<any>  => {
  console.log(user);
  const { data } = await Axios.post('/user/change-profile', {
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    phonenumber: user.phone,
    avatar: user.avatar,
    accessToken: user.accessToken,
    dob: user.dob,
  })
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  console.log(data);
  return data;
}

// Get profile API call
const getProfileService = async (id: string): Promise<any>  => {
  console.log(id);
  const { data } = await Axios.get(`/user/get-profile?userId=${id}`)

  return {
    id: data.userid,
    address: data.address ?? '',
    firstName: data.firstname ?? '',
    lastName: data.lastname ?? '',
    avatar: data.avatar ?? '',
    phoneNumber: data.phonenumber ?? '',
    email: data.email ?? '',
    dob: data.dob ?? '',
  };
}

const getUserTokensService = async (id: string): Promise<any>  => {
  const { data } = await Axios.get(`/user/get-fcmtokens?userid=${id}`)

  return data.fcmTokens;
}


// *************** ADMIN APIs ***************

// admin get all users
const getAllUsersService = async (page: number, pageSize: number, filterModel: any, sortModel: any):Promise<any> => {

  const { data } = await Axios.post(`/user/user-list/all`, {
    page, pageSize, filterModel, sortModel
  })
  console.log(data);
  return data
}

const getUsersTotalService = async (filterModel: any): Promise<any> => {
  const { data } = await Axios.post(`/user/user-list/total`, {
    filterModel,
  })
  console.log(data);
  return data.total;
}

// admin delete user
const deleteUserService = async (id: string) => {
  const { data } = await Axios.delete(`/user/user-list/${id}`)
  return data
}

// admin update profile API call
const banUserService = async (id: number, user: any) => {
  const { data } = await Axios.put(`/user/user-list/banned/${id}`, user)
  return data
}

export {
    changePasswordService,
    updateProfileService,
    getProfileService,
    getAllUsersService,
    deleteUserService,
    banUserService,
    getUsersTotalService,
    getUserTokensService,
}