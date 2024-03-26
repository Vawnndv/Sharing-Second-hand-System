import { authReducer } from './reducers/authReducers';
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    authReducer,
  },
});

export default store;