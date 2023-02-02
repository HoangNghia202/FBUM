import { createSlice } from "@reduxjs/toolkit";
// import acxios
import axios from "axios";
const initialState = {
  projectInprogress: [],
  projectEnded: [],
  projectIncoming: [],
  allProjectName: [],
  totalPageProjectInProgress: 0,
  totalPageProjectEnded: 0,
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

      if (action.payload.totalPageProjectInProgress) {
        state.totalPageProjectInProgress =
          action.payload.totalPageProjectInProgress;
      }

      if (action.payload.totalPageProjectEnded) {
        state.totalPageProjectEnded = action.payload.totalPageProjectEnded;
      }

      if (action.payload.totalPageProjectIncoming) {
        state.totalPageProjectIncoming =
          action.payload.totalPageProjectIncoming;
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
      );
      console.log("res1 >>> ", res1);
      const res2 = await axios.get(
        `${baseUrl}/api/projectEnded/page/${pageNum}`
      );
      console.log("res2 >>> ", res2);

      const res3 = await axios.get(
        `${baseUrl}/api/projectInComing/page/${pageNum}`
      );
      console.log("res3 >>> ", res3);
      const res4 = await axios.get(`${baseUrl}/api/project`);
      console.log("res4 >>> ", res4);

      const res5 = await axios.get(`${baseUrl}/api/projectInProgress`);
      console.log("res5 >>> ", res5.data);
      const res6 = await axios.get(`${baseUrl}/api/projectEndedPage`);
      console.log("res6 >>> ", res6.data);
      const res7 = await axios.get(`${baseUrl}/api/projectInComingPage`);
      console.log("res7 >>> ", res7.data);

      const res = {
        projectInprogress: res1.data,
        projectEnded: res2.data,
        projectIncoming: res3.data,
        allProjectName: res4.data,
        totalPageProjectInProgress: res5.data,
        totalPageProjectEnded: res6.data,
        totalPageProjectIncoming: res7.data,
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
      let result = { projectInprogress: res.data };
      dispatch(setProjectSlider(result));
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
      let result = { projectEnded: res.data };
      dispatch(setProjectSlider(result));
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
        `${baseUrl}/api/projectInComing/page/${pageNum}`
        // `${baseUrl}/projectInProgress`
      );
      console.log("res1 >>> ", res1.data);

      const result = { projectIncoming: res1.data };
      console.log("res >>> ", result);
      dispatch(setProjectSlider(result));
    } catch (error) {
      throw error;
    }
  };
};
export const { setProjectSlider } = productSliderSlice.actions;
export default productSliderSlice.reducer;
