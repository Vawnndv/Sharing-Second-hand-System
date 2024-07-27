import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  receivePosts: number[];
  likePosts: number[]; 
  statsReceivePosts: number[]; 
  statusLikePosts: number[];
  receiveCount: string;
  giveCount: string;
  isLikePostRefresh: boolean;
  isReceivePostRefresh: boolean;
};

const initialState: UserState = {
  likePosts: [],
  receivePosts: [],
  statsReceivePosts: [],
  statusLikePosts: [],
  receiveCount: '',
  giveCount: '',
  isLikePostRefresh: false,
  isReceivePostRefresh: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: initialState,
  },
  reducers: {
    removeUser: (state, action) => {
      state.userData = initialState;
    },

    updateCountOrder: (state, action) => {
      state.userData.receiveCount = action.payload.receiveCount;
      state.userData.giveCount = action.payload.giveCount;
    },

    updateIsLikePostRefresh: (state, action) => {
      state.userData.isLikePostRefresh = action.payload;
    },

    updateIsReceivePostRefresh: (state, action) => {
      state.userData.isReceivePostRefresh = action.payload;
    },

    updateLikePosts: (state, action) => {
      state.userData.likePosts = action.payload;
      state.userData.statusLikePosts = [];
      state.userData.isLikePostRefresh = false;
    },

    updateReceivePosts: (state, action) => {
      state.userData.receivePosts = action.payload;
      state.userData.statsReceivePosts = [];
      state.userData.isReceivePostRefresh = false;
    },

    addStatusReceivePost: (state, action) => {
      const index = state.userData.statsReceivePosts.findIndex(element => Math.abs(element) === Math.abs(action.payload));

      if (index !== -1) {
        // Remove element if found
        state.userData.statsReceivePosts.splice(index, 1);
      }

      if (action.payload < 0) {
        let newReceivePosts = [...state.userData.receivePosts];
        newReceivePosts = newReceivePosts.filter(item => item !== Math.abs(action.payload));
        state.userData.receivePosts = newReceivePosts;
      } else {
        state.userData.receivePosts.push(action.payload);
      }
      // Add new payload
      state.userData.statsReceivePosts.push(action.payload);
      state.userData.isReceivePostRefresh = true;
    },

    removeStatusReceivePost: (state) => {
      state.userData.statsReceivePosts = [];
      state.userData.isReceivePostRefresh = false;
    },

    addStatusLikePost: (state, action) => {
      const index = state.userData.statusLikePosts.findIndex(element => Math.abs(element) === Math.abs(action.payload));

      if (index !== -1) {
        // Remove element if found
        state.userData.statusLikePosts.splice(index, 1);
      }

      if (action.payload < 0) {
        let newLikePosts = [...state.userData.likePosts];
        newLikePosts = newLikePosts.filter(item => item !== Math.abs(action.payload));
        state.userData.likePosts = newLikePosts;
      } else {
        state.userData.likePosts.push(action.payload);
        state.userData.isLikePostRefresh = true;
      }
      // Add new payload
      state.userData.statusLikePosts.push(action.payload);
    },

    removeStatusLikePost: (state) => {
      state.userData.statusLikePosts = [];
      state.userData.isLikePostRefresh = false;
    },
  },
});

export const userReducer = userSlice.reducer;
export const {updateLikePosts, updateReceivePosts, updateCountOrder, addStatusReceivePost, removeStatusReceivePost, removeUser, addStatusLikePost, removeStatusLikePost, updateIsLikePostRefresh, updateIsReceivePostRefresh} = userSlice.actions;

export const userSelector = (state: any) => state.userReducer.userData;