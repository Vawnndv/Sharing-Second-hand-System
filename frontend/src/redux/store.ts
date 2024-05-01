import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as Auth from './reducers/authReducers';
import * as User from './reducers/userReducers'
import { useDispatch } from 'react-redux';
import { handleClickMenu } from './reducers/menuReducers';

const rootReducer = combineReducers({
  // User reducer
  userLogin: Auth.userLoginReducer,
  userChangePassword: User.userChangePasswordReducer,
  userGetProfile: User.userGetProfileReducer,
  userUpdateProfile: User.userUpdateProfileReducer,

  // Menu reducer
  // eslint-disable-next-line object-shorthand
  handleClickMenu: handleClickMenu
});


// Get userInfo from localStorage
const userInfoFormStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null;

// initialState
const initialState = {
  userLogin: { userInfo: userInfoFormStorage }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()