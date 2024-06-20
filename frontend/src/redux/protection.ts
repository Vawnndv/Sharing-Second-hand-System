// eslint-disable-next-line import/no-cycle
import { logoutAction } from './actions/authActions';

export const ErrorsAction = (error: any, dispatch: any, action: string) => {
  const message = error.response && error.response.data.message ? error.response.data.message : error.message;
  if (message === 'Not authorized, token failed') {
    // we are going to log out if token fail
    dispatch(logoutAction());
  }
  return dispatch({ type: action, payload: message });
};

// api token protection
