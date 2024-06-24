import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import * as authConstants from '../constants/authConstants';
import * as userConstants from '../constants/userConstants';
import * as collaboratorConstants from '../constants/collaboratorConstants';

import { loginService } from '../services/authServices';
import { Action } from 'redux';
import { ErrorsAction } from '../protection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import * as authApi from '../services/authServices';
import toast from 'react-hot-toast';

const loginAction = (datas: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: authConstants.USER_LOGIN_REQUEST });
    const response = await loginService(datas);
    dispatch({
      type: authConstants.USER_LOGIN_SUCCESS,
      payload: response
    });
    toast.success(`Chào mừng quay trở lại ${response?.firstName}`)

  } catch (error) {
    ErrorsAction(error, dispatch, authConstants.USER_LOGIN_FAIL);
  }
};

const updateUserInfoAction = (userInfo: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({
      type: authConstants.USER_LOGIN_SUCCESS,
      payload: userInfo
    })
  } catch (error) {
    ErrorsAction(error, dispatch, authConstants.USER_LOGIN_FAIL);
  }
}
const logoutAction = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  await authApi.logoutService()

  dispatch({ type: authConstants.USER_LOGOUT })
  dispatch({ type: authConstants.USER_LOGIN_RESET })
  dispatch({ type: userConstants.USER_GET_PROFILE_RESET })
  dispatch({ type: userConstants.USER_UPDATE_PROFILE_RESET })
  dispatch({ type: userConstants.USER_CHANGE_PASSWORD_RESET })
  dispatch({ type: userConstants.GET_ALL_USERS_RESET })
  dispatch({ type: userConstants.DELETE_USER_RESET })
  dispatch({ type: collaboratorConstants.GET_ALL_COLLABORATORS_RESET })
  dispatch({ type: collaboratorConstants.DELETE_COLLABORATOR_RESET })
  dispatch({ type: collaboratorConstants.UPDATE_COLLABORATOR_RESET })
  dispatch({ type: collaboratorConstants.CREATE_COLLABORATOR_RESET })
  localStorage.removeItem('userInfo')
}

export {
  loginAction,
  updateUserInfoAction,
  logoutAction,
}