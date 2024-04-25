import * as userConstants from '../constants/userConstants'
import { UserInfo } from '../services/authServices';

interface UserState {
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: any;
    userInfo?: UserInfo;
    message?: string;
}

// CHANGE PASSWORD
export const userChangePasswordReducer = (state: UserState = {}, action: { type: string; payload?: any }): UserState => {
  switch (action.type) {
  case userConstants.USER_CHANGE_PASSWORD_REQUEST:
    return { isLoading: true }
  case userConstants.USER_CHANGE_PASSWORD_SUCCESS:
    return { isLoading: false, isSuccess: true, message: action.payload.message }
  case userConstants.USER_CHANGE_PASSWORD_FAIL:
    return { isLoading: false, isError: action.payload }
  case userConstants.USER_CHANGE_PASSWORD_RESET:
    return {}
  default:
    return state
  }
}

// UPDATE PROFILE
export const userUpdateProfileReducer = (state: UserState = {}, action: { type: string; payload?: any }): UserState => {
  switch (action.type) {
  case userConstants.USER_UPDATE_PROFILE_REQUEST:
    return { isLoading: true }
  case userConstants.USER_UPDATE_PROFILE_SUCCESS:
    return { isLoading: false, userInfo: action.payload, isSuccess: true }
  case userConstants.USER_UPDATE_PROFILE_FAIL:
    return { isLoading: false, isError: action.payload }
  case userConstants.USER_UPDATE_PROFILE_RESET:
    return {}
  default:
    return state
  }
}

// USER INFO
export const userGetProfileReducer = ( state = {}, action: { type: string; payload?: any }): UserState => {
  switch (action.type) {
  case userConstants.USER_GET_PROFILE_REQUEST:
    return { isLoading: true }
  case userConstants.USER_GET_PROFILE_SUCCESS:
    return { isLoading: false, userInfo: action.payload, isSuccess: true }
  case userConstants.USER_GET_PROFILE_FAIL:
    return { isLoading: false, isError: action.payload }
  case userConstants.USER_GET_PROFILE_RESET:
    return {}
  default:
    return state
  }
}