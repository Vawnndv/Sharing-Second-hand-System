import Axios from '../APIs/Axios';

// getChatListCollaborator API call
const getChatListCollaborator = async (userID: string): Promise<any>  => {
  const { data }: any = await Axios.get(`/chat/getChatListCollaborator?userID=${userID}`)
  return {
    data
  };
}

// getChatListUser API call
const getChatListUser = async (userID: string): Promise<any>  => {
  const { data }: any = await Axios.get(`/chat/getChatListUser?userID=${userID}`)
  return {
    data
  };
}

// getChatWarehouse API call
const getChatWarehouse = async (userID: string): Promise<any>  => {
  const { data }: any = await Axios.get(`/chat/getChatWarehouse?userID=${userID}`)
  return {
    data
  };
}

// Get Order API call
const createNewChatUser = async (firstuserid: string, seconduserid: string): Promise<any>  => {
  console.log('API', firstuserid, seconduserid)
  const { data } = await Axios.post(`/chat/createNewChatUser`, {
    firstuserid,
    seconduserid
  })

  return {
    data
  };
}

// Get getWareHouseByUserID
const getWareHouseByUserID = async (userID: string): Promise<any>  => {
  const { data }: any = await Axios.get(`/chat/getWareHouseByUserID?userID=${userID}`)
  return {
    data
  };
}

export {
  getChatListCollaborator,
  getChatListUser,
  getChatWarehouse,
  createNewChatUser,
  getWareHouseByUserID
}