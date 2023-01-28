import { createSlice } from "@reduxjs/toolkit";
// import acxios
import axios from "axios";
const initialState = {
  projectInprogress: [],
  projectEnded: [],
  projectIncoming: [],
  allProjectName: [],
  totalPageProjectInProgress: 3,
  totalPageProjectEnded: 2,
  totalPageProjectIncoming: 0,
};
const baseUrl = process.env.REACT_APP_JSON_API;
const productSliderSlice = createSlice({
  name: "projectSlider",
  initialState,
  reducers: {
    setProjectSlider(state, action) {
      if (action.payload.projectInprogress) {
        state.projectInprogress = action.payload.projectInprogress;
      }

      if (action.payload.projectEnded) {
        state.projectEnded = action.payload.projectEnded;
      }

      if (action.payload.projectIncoming) {
        state.projectIncoming = action.payload.projectIncoming;
      }

      if (action.payload.allProjectName) {
        state.allProjectName = action.payload.allProjectName;
      }
    },
  },
});

export const fetchProjects = (pageNum) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res1 = await axios.get(
        `${baseUrl}/api/projectInProgress/page/${pageNum}`
        // `${baseUrl}/projectInProgress`
      );
      console.log("res1 >>> ", res1);
      const res2 = await axios.get(
        `${baseUrl}/api/projectEnded/page/${pageNum}`
        // `${baseUrl}/projectEnded`
      );
      console.log("res2 >>> ", res2);

      const res3 = await axios.get(`${baseUrl}/api/project`);
      console.log("res3 >>> ", res3);

      const res = {
        projectInprogress: res1.data,
        projectEnded: res2.data,
        allProjectName: res3.data,
      };
      console.log("res >>> ", res);
      dispatch(setProjectSlider(res));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchProjectsInprogress = (pageNum) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res = await axios.get(
        `${baseUrl}/api/projectInProgress/page/${pageNum}`
        // `${baseUrl}/projectInProgress`
      );
      console.log("res >>> ", res.data);
      dispatch(setProjectSlider(res.data));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchProjectsEnded = (pageNum) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res = await axios.get(
        `${baseUrl}/api/projectEnded/page/${pageNum}`
        // `${baseUrl}/projectEnded`
      );
      console.log("fetch project ended >>> ", res.data);

      dispatch(setProjectSlider(res.data));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchProjectsIncoming = (pageNum) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res1 = await axios.get(
        `${baseUrl}/api/projectInProgress/page/${pageNum}`
        // `${baseUrl}/projectInProgress`
      );
      console.log("res1 >>> ", res1);

      const res = { projectInprogress: res1.data };
      console.log("res >>> ", res);
      dispatch(setProjectSlider(res));
    } catch (error) {
      throw error;
    }
  };
};
export const { setProjectSlider } = productSliderSlice.actions;
export default productSliderSlice.reducer;
