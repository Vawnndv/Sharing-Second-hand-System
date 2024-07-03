import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  accessToken: string;
  roleID: string;
  fcmTokens: string[];
  likePosts: number[]; 
  receivePosts: number[]; 
  statsReceivePosts: number[]; 
  statusLikePosts: number[];
  deviceid: string;
};

const initialState: AuthState = {
  id: '',
  email: '',
  accessToken: '',
  roleID: '',
  fcmTokens: [],
  likePosts: [],
  receivePosts: [],
  statsReceivePosts: [],
  statusLikePosts: [],
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

    updateLikePosts: (state, action) => {
      state.authData.likePosts = action.payload;
      state.authData.statusLikePosts = [];
    },

    updateReceivePosts: (state, action) => {
      state.authData.receivePosts = action.payload;
      state.authData.statsReceivePosts = [];
    },

    addStatusReceivePost: (state, action) => {
      console.log(action.payload)
      const index = state.authData.statsReceivePosts.findIndex(element => Math.abs(element) === Math.abs(action.payload));

      if (index !== -1) {
        // Remove element if found
        state.authData.statsReceivePosts.splice(index, 1);
      }

      if (action.payload < 0) {
        let newReceivePosts = [...state.authData.receivePosts];
        newReceivePosts = newReceivePosts.filter(item => item !== Math.abs(action.payload));
        state.authData.receivePosts = newReceivePosts;
      } else {
        state.authData.receivePosts.push(action.payload);
      }
      // Add new payload
      console.log(action.payload)
      state.authData.statsReceivePosts.push(action.payload);
    },

    removeStatusReceivePost: (state) => {
      state.authData.statsReceivePosts = [];
    },

    addStatusLikePost: (state, action) => {
      console.log(action.payload)
      const index = state.authData.statusLikePosts.findIndex(element => Math.abs(element) === Math.abs(action.payload));

      if (index !== -1) {
        // Remove element if found
        state.authData.statusLikePosts.splice(index, 1);
      }

      if (action.payload < 0) {
        let newLikePosts = [...state.authData.likePosts];
        newLikePosts = newLikePosts.filter(item => item !== Math.abs(action.payload));
        state.authData.likePosts = newLikePosts;
      } else {
        state.authData.likePosts.push(action.payload);
      }
      // Add new payload
      console.log(action.payload)
      state.authData.statusLikePosts.push(action.payload);
    },

    removeStatusLikePost: (state) => {
      state.authData.statusLikePosts = [];
    },
  },
});

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth, updateAuth, updateLikePosts, updateReceivePosts, addStatusReceivePost, removeStatusReceivePost, addStatusLikePost, removeStatusLikePost} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;