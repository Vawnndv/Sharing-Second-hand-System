import * as collaboratorConstants from '../constants/collaboratorConstants'
import { UserInfo } from '../services/authServices';

interface CollaboratorState {
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: any;
    collaboratorInfo?: UserInfo;
    message?: string;
    collaborators?: any;
}

// ADMIN GET ALL USERS
export const adminGetAllCollaboratorsReducer = (state: CollaboratorState = { collaborators: [] }, action: { type: string; payload?: any }): CollaboratorState => {
  switch (action.type) {
  case collaboratorConstants.GET_ALL_COLLABORATORS_REQUEST:
    return { isLoading: true }
  case collaboratorConstants.GET_ALL_COLLABORATORS_SUCCESS:
    return { isLoading: false, collaborators: action.payload.collaborators }
  case collaboratorConstants.GET_ALL_COLLABORATORS_FAIL:
    return { isLoading: false, isError: action.payload }
  case collaboratorConstants.GET_ALL_COLLABORATORS_RESET:
    return {
      collaborators: []
    }
  default:
    return state
  }
}

// ADMIN DELETE USER
export const adminDeleteCollaboratorReducer = (state = {}, action: { type: string; payload?: any }): CollaboratorState => {
  switch (action.type) {
  case collaboratorConstants.DELETE_COLLABORATOR_REQUEST:
    return { isLoading: true }
  case collaboratorConstants.DELETE_COLLABORATOR_SUCCESS:
    return { isLoading: false, isSuccess: true }
  case collaboratorConstants.DELETE_COLLABORATOR_FAIL:
    return { isLoading: false, isError: action.payload }
  case collaboratorConstants.DELETE_COLLABORATOR_RESET:
    return {}
  default:
    return state
  }
}

// ADMIN UPDATE PROFILE
export const adminEditCollaboratorReducer = ( state = {}, action: { type: string; payload?: any }): CollaboratorState => {
  switch (action.type) {
  case collaboratorConstants.UPDATE_COLLABORATOR_REQUEST:
    return { isLoading: true }
  case collaboratorConstants.UPDATE_COLLABORATOR_SUCCESS:
    return { isLoading: false, collaboratorInfo: action.payload, isSuccess: true }
  case collaboratorConstants.UPDATE_COLLABORATOR_FAIL:
    return { isLoading: false, isError: action.payload }
  case collaboratorConstants.UPDATE_COLLABORATOR_RESET:
    return {}
  default:
    return state
  }
}

// ADMIN UPDATE PROFILE
export const adminCreateCollaboratorReducer = ( state = {}, action: { type: string; payload?: any }): CollaboratorState => {
  switch (action.type) {
  case collaboratorConstants.CREATE_COLLABORATOR_REQUEST:
    return { isLoading: true }
  case collaboratorConstants.CREATE_COLLABORATOR_SUCCESS:
    return { isLoading: false, collaboratorInfo: action.payload, isSuccess: true }
  case collaboratorConstants.CREATE_COLLABORATOR_FAIL:
    return { isLoading: false, isError: action.payload }
  case collaboratorConstants.CREATE_COLLABORATOR_RESET:
    return {}
  default:
    return state
  }
}



