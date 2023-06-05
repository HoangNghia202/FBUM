import { createSlice } from "@reduxjs/toolkit";
// import acxios
import axios from "axios";
const initialState = {
  isUserLogin: false,
  userInfo: {},
};
const baseUrl = process.env.REACT_APP_JSON_API;
const UserSlice = createSlice({
  name: "userSlide",
  initialState,
  reducers: {
    setUserSlider(state, action) {
      return { ...state, isUserLogin: true, userInfo: action.payload };
    },
  },
});

export default UserSlice.reducer;
export const { setUserSlider } = UserSlice.actions;
