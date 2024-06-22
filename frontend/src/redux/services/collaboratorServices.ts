import Axios from '../APIs/Axios';

// *************** ADMIN APIs ***************

// admin get all Collaborator
const getAllCollaboratorServices = async (page: number, pageSize: number, filterModel: any, sortModel: any) => {
  const { data } = await Axios.post(`/collaborator/collaborator-list/all`, {
    page, pageSize, filterModel, sortModel
  })
  return data
}

const getCollaboratorTotalService = async (page: number, pageSize: number, filterModel: any, sortModel: any): Promise<any> => {
  const { data } = await Axios.post(`/collaborator/collaborator-list/total`, {
    page, pageSize, filterModel, sortModel
  })
  return data.total;
}

const getCollaboratorsTotalService = async (filterModel: any): Promise<any> => {
  const { data } = await Axios.post(`/collaborator/collaborator-list/total`, {
    filterModel,
  })
  return data.total;
}

// admin delete user
const deleteCollaboratorService = async (id: string) => {
  const { data } = await Axios.delete(`/collaborator/collaborator-list/${id}`)
  return data
}

// admin update profile API call
const updateCollaboratorService = async (id: string, collaborator: any) => {
  const { data } = await Axios.put(`/collaborator/collaborator-list/${id}`, collaborator)
  return data
}

// admin reset password API call
const resetCollaboratorPasswordService = async (collaborator: any) => {
  const { data } = await Axios.post(`/collaborator/collaborator-list/reset-password`, collaborator)
  return data
}

// admin create new collaborator API call
const createCollaboratorService = async (collaborator: any) => {
  const { data } = await Axios.post(`/collaborator/collaborator-list/create`, collaborator);
  return data
}

export {
    getAllCollaboratorServices,
    deleteCollaboratorService,
    updateCollaboratorService,
    getCollaboratorTotalService,
    getCollaboratorsTotalService,
    resetCollaboratorPasswordService,
    createCollaboratorService,
}