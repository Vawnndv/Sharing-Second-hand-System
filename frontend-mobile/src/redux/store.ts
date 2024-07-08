import { authReducer } from './reducers/authReducers';
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from './reducers/userReducers';

const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
  },
});

export default store;