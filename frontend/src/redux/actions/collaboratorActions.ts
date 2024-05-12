import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import * as collaboratorConstants from '../constants/collaboratorConstants';
import { Action } from 'redux';
import { ErrorsAction } from '../protection';
import * as collaboratorApi from '../services/collaboratorServices';
import toast from 'react-hot-toast';

// admin get all collaborators action
const getAllCollaboratorsAction = (page: number, pageSize: number, filterModel: any, sortModel: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    console.log(page, pageSize)
    dispatch({ type: collaboratorConstants.GET_ALL_COLLABORATORS_REQUEST })
    const response = await collaboratorApi.getAllCollaboratorServices(page, pageSize, filterModel, sortModel)
    dispatch({ type: collaboratorConstants.GET_ALL_COLLABORATORS_SUCCESS, payload: response })
  } catch (error) {
    ErrorsAction(error, dispatch, collaboratorConstants.GET_ALL_COLLABORATORS_FAIL)
  }
}


// admin delete collaborator action
const deleteCollaboratorAction = (id: string): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    dispatch({ type: collaboratorConstants.DELETE_COLLABORATOR_REQUEST })
    await collaboratorApi.deleteCollaboratorService(id)
    dispatch({ type: collaboratorConstants.DELETE_COLLABORATOR_SUCCESS })
    toast.success('collaborator Was Deleted Successfully')
  } catch (error) {
    ErrorsAction(error, dispatch, collaboratorConstants.DELETE_COLLABORATOR_FAIL)
  }
}

// update profile action
const updateCollaboratorAction = (id: string, collaborator: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    dispatch({ type: collaboratorConstants.UPDATE_COLLABORATOR_REQUEST })
    const response = await collaboratorApi.updateCollaboratorService(id, collaborator)
    dispatch({
      type: collaboratorConstants.UPDATE_COLLABORATOR_SUCCESS,
      payload: response
    })
    toast.success('collaborator Edit successfully')
  } catch (error) {
    ErrorsAction(error, dispatch, collaboratorConstants.UPDATE_COLLABORATOR_FAIL)
  }
}

// create profile action
const createCollaboratorAction = (collaborator: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    dispatch({ type: collaboratorConstants.CREATE_COLLABORATOR_REQUEST })
    const response = await collaboratorApi.createCollaboratorService(collaborator)
    dispatch({
      type: collaboratorConstants.CREATE_COLLABORATOR_SUCCESS,
      payload: response
    })
    toast.success('collaborator Edit successfully')
  } catch (error) {
    ErrorsAction(error, dispatch, collaboratorConstants.CREATE_COLLABORATOR_FAIL)
  }
}
export {
    getAllCollaboratorsAction,
    deleteCollaboratorAction,
    updateCollaboratorAction,
    createCollaboratorAction,
}
