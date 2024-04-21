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
    avatar: user.Avatar,
  })
  // if (data) {
  //   localStorage.setItem('userInfo', JSON.stringify(data))
  // }
  console.log(data);
  return data;
}

// Get profile API call
const getProfileService = async (id: string): Promise<any>  => {
  console.log(id);
  const { data } = await Axios.get(`/user/get-profile?userId=${id}`)
  console.log(data);

  return {
    id: data.userid,
    address: data.address ?? '',
    firstName: data.firstname ?? '',
    lastName: data.lastname ?? '',
    avatar: data.avatar ?? '',
    phoneNumber: data.phonenumber ?? '',
    email: data.email ?? '',
  };
}

export {
    changePasswordService,
    updateProfileService,
    getProfileService,
}