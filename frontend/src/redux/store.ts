import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as Auth from './reducers/authReducers';
import * as User from './reducers/userReducers'
import * as Collaborator from './reducers/collaboratorReducers'
import { useDispatch } from 'react-redux';
import { handleClickMenu } from './reducers/menuReducers';

const rootReducer = combineReducers({
  // User reducer
  userLogin: Auth.userLoginReducer,
  userChangePassword: User.userChangePasswordReducer,
  userGetProfile: User.userGetProfileReducer,
  userUpdateProfile: User.userUpdateProfileReducer,
  adminGetAllUsers: User.adminGetAllUsersReducer,
  adminDeleteUser: User.adminDeleteUserReducer,
  adminGetAllCollaborators: Collaborator.adminGetAllCollaboratorsReducer,
  adminDeleteCollaborator: Collaborator.adminDeleteCollaboratorReducer,
  adminEditCollaborator: Collaborator.adminEditCollaboratorReducer,

  // eslint-disable-next-line object-shorthand
  handleClickMenu: handleClickMenu
});


// Get userInfo from localStorage
// const userInfoFormStorage = localStorage.getItem('userInfo')
//   ? JSON.parse(localStorage.getItem('userInfo')) 
//   : null;

const userInfoString = localStorage.getItem('userInfo');

const userInfoFormStorage = userInfoString !== null ? JSON.parse(userInfoString) : null;
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