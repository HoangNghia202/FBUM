import { configureStore } from "@reduxjs/toolkit";
import productSliderReducer from "./ProductSlider";

const store = configureStore({
  reducer: {
    productSlider: productSliderReducer,
  },
});

export default store;
