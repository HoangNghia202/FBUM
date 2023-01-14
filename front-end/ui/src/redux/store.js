import { configureStore } from "@reduxjs/toolkit";
import productSliderReducer from "./ProductSlider";
import userSliderReducer from "./UserSlider";

const store = configureStore({
  reducer: {
    productSlider: productSliderReducer,
    userSlider: userSliderReducer,
  },
});

export default store;
