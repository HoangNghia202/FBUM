import { createSlice } from "@reduxjs/toolkit";
// import acxios
import axios from "axios";
const initialState = [];
const baseUrl = process.env.REACT_APP_JSON_API;
const productSliderSlice = createSlice({
  name: "productSlider",
  initialState,
  reducers: {
    setProductSlider(state, action) {
      return action.payload;
    },
  },
});

export const fetchProduct = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${baseUrl}/projects`);
      console.log("res >>> ", res);
      dispatch(setProductSlider(res.data));
    } catch (error) {
      throw error;
    }
  };
};
export const { setProductSlider } = productSliderSlice.actions;
export default productSliderSlice.reducer;
