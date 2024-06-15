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
const getProfileAction = (id: string): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: userConstants.USER_GET_PROFILE_REQUEST })
    const response = await userApi.getProfileService(id)
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
    toast.success('Đã cập nhật thông tin tài khoản')
    dispatch({
      type: authConstants.USER_LOGIN_SUCCESS,
      payload: response
    })
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_UPDATE_PROFILE_FAIL)
  }
}


// admin get all users action
const getAllUsersAction = (page: number, pageSize: number, filterModel: any, sortModel: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    dispatch({ type: userConstants.GET_ALL_USERS_REQUEST })
    const response = await userApi.getAllUsersService(page, pageSize, filterModel, sortModel)
    dispatch({ type: userConstants.GET_ALL_USERS_SUCCESS, payload: response })
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.GET_ALL_USERS_FAIL)
  }
}


// admin delete user action
const deleteUserAction = (id: string): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch =>  {
  try {
    dispatch({ type: userConstants.DELETE_USER_REQUEST })
    await userApi.deleteUserService(id)
    dispatch({ type: userConstants.DELETE_USER_SUCCESS })
    toast.success('Xóa người dùng thành công')
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.DELETE_USER_FAIL)
  }
}

export {
    changePasswordAction,
    updateProfileAction,
    getProfileAction,
    getAllUsersAction,
    deleteUserAction,
}
