// Change password action
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import * as userConstants from '../constants/userConstants';
import { Action } from 'redux';
import { ErrorsAction } from '../protection';
import * as userApi from '../services/userServices';
import toast from 'react-hot-toast';
import * as authConstants from '../constants/authConstants'

const changePasswordAction = (password: string): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: userConstants.USER_CHANGE_PASSWORD_REQUEST })
    const response = await userApi.changePasswordService(
      password
    )
    dispatch({
      type: userConstants.USER_CHANGE_PASSWORD_SUCCESS,
      payload: response
    })
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_CHANGE_PASSWORD_FAIL)
  }
}

// get profile action
const getProfileAction = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: userConstants.USER_GET_PROFILE_REQUEST })
    const response = await userApi.getProfileService()
    dispatch({
      type: userConstants.USER_GET_PROFILE_SUCCESS,
      payload: response
    })
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_GET_PROFILE_FAIL)
  }
}

// update profile action
const updateProfileAction = (user: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: userConstants.USER_UPDATE_PROFILE_REQUEST })
    const response = await userApi.updateProfileService(user)
    dispatch({
      type: userConstants.USER_UPDATE_PROFILE_SUCCESS,
      payload: response
    })
    toast.success('Profile Updated')
    dispatch({
      type: authConstants.USER_LOGIN_SUCCESS,
      payload: response
    })
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_UPDATE_PROFILE_FAIL)
  }
}

export {
    changePasswordAction,
    updateProfileAction,
    getProfileAction,
}
