import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import axios from "axios";

const initialState = {
  loading: false,
  error: "",
  projectInprogress: [],
  projectEnded: [],
  projectIncoming: [],
  totalPageProjectInProgress: 0,
  totalPageProjectEnded: 0,
  totalPageProjectIncoming: 0,
  tabPanel: "1",
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

    setTabPanel(state, action) {
      state.tabPanel = action.payload;
    },
    startLoadingProject(state) {
      state.loading = true;
    },
    loadingProjectFailed(state) {
      state.loading = false;
      state.error = "Loading project failed, please try again later";
    },
    loadingProjectSuccess(state) {
      state.loading = false;
      state.error = "";
    },
  },
});

export const fetchProjects = (pageNum, token) => {
  console.log("token in fetch project >>> ", token);

  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res1 = await axios.get(
        `${baseUrl}/api/projectInProgress/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("res1 >>> ", res1);
      const res2 = await axios.get(
        `${baseUrl}/api/projectEnded/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("res2 >>> ", res2);

      const res3 = await axios.get(
        `${baseUrl}/api/projectInComing/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("res3 >>> ", res3);
      const res5 = await axios.get(`${baseUrl}/api/projectInProgressPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res5 >>> ", res5.data);
      const res6 = await axios.get(`${baseUrl}/api/projectEndedPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res6 >>> ", res6.data);
      const res7 = await axios.get(`${baseUrl}/api/projectInComingPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res7 >>> ", res7.data);

      const res = {
        projectInprogress: res1.data,
        projectEnded: res2.data,
        projectIncoming: res3.data,
        totalPageProjectInProgress: res5.data,
        totalPageProjectEnded: res6.data,
        totalPageProjectIncoming: res7.data,
      };
      console.log("res >>> ", res);
      dispatch(setProjectSlider(res));
    } catch (error) {
      console.error("error >>> ", error);
    }
  };
};

export const fetchProjectsInprogress = (pageNum, token) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res = await axios.get(
        `${baseUrl}/api/projectInProgress/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
        // `${baseUrl}/projectInProgress`
      );
      console.log("res >>> ", res.data);
      const res1 = await axios.get(`${baseUrl}/api/projectInProgressPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let result = {
        projectInprogress: res.data,
        totalPageProjectInProgress: res1.data,
      };
      dispatch(setProjectSlider(result));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchProjectsEnded = (pageNum, token) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res = await axios.get(
        `${baseUrl}/api/projectEnded/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
        // `${baseUrl}/projectEnded`
      );
      console.log("fetch project ended >>> ", res.data);
      const res1 = await axios.get(`${baseUrl}/api/projectEndedPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let result = { projectEnded: res.data, totalPageProjectEnded: res1.data };
      dispatch(setProjectSlider(result));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchProjectsIncoming = (pageNum, token) => {
  return async (dispatch, getState) => {
    console.log("run in to thunk action creator");
    console.log("state:", getState());
    try {
      const res = await axios.get(
        `${baseUrl}/api/projectInComing/page/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
        // `${baseUrl}/projectInProgress`
      );
      console.log("res >>> ", res.data);
      const res1 = await axios.get(`${baseUrl}/api/projectInComingPage`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = {
        projectIncoming: res.data,
        totalPageProjectIncoming: res1.data,
      };
      console.log("res >>> ", result);
      dispatch(setProjectSlider(result));
    } catch (error) {
      throw error;
    }
  };
};
export const {
  setProjectSlider,
  setTabPanel,
  startLoadingProject,
  loadingProjectFailed,
  loadingProjectSuccess,
} = productSliderSlice.actions;
export default productSliderSlice.reducer;
