import Axios from '../APIs/Axios';


// Change password API
const changePasswordService = async (password: string): Promise<any>  => {
  const { data } = await Axios.put('/user/change-password', password)
  return data
}

// update profile API call
const updateProfileService = async (user: any): Promise<any>  => {
  const { data } = await Axios.put('/user/profile', user)
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }
  return data
}

// Get profile API call
const getProfileService = async (): Promise<any>  => {
  const { data } = await Axios.get('/user/info')

  return data
}

export {
    changePasswordService,
    updateProfileService,
    getProfileService,
}