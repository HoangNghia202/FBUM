import { configureStore } from "@reduxjs/toolkit";
import projectSliderReducer from "./ProjectSlider";
import userSliderReducer from "./UserSlider";

const store = configureStore({
  reducer: {
    projectSlider: projectSliderReducer,
    userSlider: userSliderReducer,
  },
});

export default store;
