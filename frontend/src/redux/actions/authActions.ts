import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import * as authConstants from '../constants/authConstants';
import { loginService } from '../services/authServices';
import { Action } from 'redux';
import { ErrorsAction } from '../protection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import * as authApi from '../services/authServices';

const loginAction = (datas: any): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    dispatch({ type: authConstants.USER_LOGIN_REQUEST });
    const response = await loginService(datas);
    dispatch({
      type: authConstants.USER_LOGIN_SUCCESS,
      payload: response
    });
  } catch (error) {
    ErrorsAction(error, dispatch, authConstants.USER_LOGIN_FAIL);
  }
};

const logoutAction = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  // await authApi.logoutService()
  dispatch({ type: authConstants.USER_LOGOUT })
  localStorage.removeItem('userInfo')
}

export {
  loginAction,
  logoutAction,
}