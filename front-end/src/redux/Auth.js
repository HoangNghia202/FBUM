import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLogin: false,
  userInfo: {},
  isFetching: false,
  err: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLogin(state) {
      state.isFetching = true;
    },

    loginSuccess(state, action) {
      state.isFetching = false;
      state.isUserLogin = true;
      state.userInfo = action.payload;
    },

    loginFailed(state) {
      state.isFetching = false;
      state.err = true;
    },

    logout(state) {
      state.isFetching = false;
      state.isUserLogin = false;
      state.userInfo = {};
    },
  },
});

export default AuthSlice.reducer;
export const { startLogin, loginSuccess, loginFailed, logout } =
  AuthSlice.actions;
