import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  accessToken: string;
  roleID: string;
  fcmTokens: string[];
  deviceid: string;
};

const initialState: AuthState = {
  id: '',
  email: '',
  accessToken: '',
  roleID: '',
  fcmTokens: [],
  deviceid: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action)  => {
      state.authData = action.payload;
    },

    updateAuth: (state, action) => {
      state.authData = { ...state.authData, ...action.payload };
    },

    removeAuth: (state, action) => {
      state.authData = initialState;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth, updateAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;