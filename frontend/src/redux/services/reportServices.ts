import Axios from '../APIs/Axios';

const getUserReports = async (): Promise<any>  => {
  const { data } = await Axios.get(`/report/userReports`)
  return data
}

const getPostReports = async (userID: string): Promise<any>  => {
  const { data } = await Axios.get(`/report/postReposts?userID=${userID}`)
  return data
}

const putUpdateReport = async ({reportID}: any): Promise<any>  => {
  const { data } = await Axios.put(`/report`, {
    reportID
  })
  return data
}

export {
  getUserReports,
  getPostReports,
  putUpdateReport
}