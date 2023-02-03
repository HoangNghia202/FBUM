import { configureStore } from "@reduxjs/toolkit";
import projectSliderReducer from "./ProjectSlider";
import userSliderReducer from "./UserSlider";
import staffSliderReducer from "./StaffSlider";

const store = configureStore({
  reducer: {
    projectSlider: projectSliderReducer,
    userSlider: userSliderReducer,
    staffSlider: staffSliderReducer,
  },
});

export default store;
