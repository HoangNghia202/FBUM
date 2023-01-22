import { createSlice } from "@reduxjs/toolkit";
// import acxios
import axios from "axios";
const initialState = {
  projectInprogress: [],
  projectEnded: [],
  projectIncoming: [],
};
const baseUrl = process.env.REACT_APP_JSON_API;
const productSliderSlice = createSlice({
  name: "projectSlider",
  initialState,
  reducers: {
    setProjectSlider(state, action) {
      const { projectInprogress, projectEnded } = action.payload;
      state.projectInprogress = projectInprogress;
      state.projectEnded = projectEnded;
    },
    removeProject(state, action) {
      const { projectId } = action.payload;
      let newState = { ...state };
      console.log("newState br for change >>> ", newState);

      newState.projectInprogress = newState.projectInprogress.filter(
        (project) => project.id !== projectId
      );
      newState.projectEnded = newState.projectEnded.filter(
        (project) => project.id !== projectId
      );
      console.log("newState >>> ", newState);

      return newState;
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
      const res = { projectInprogress: res1.data, projectEnded: res2.data };
      console.log("res >>> ", res);
      dispatch(setProjectSlider(res));
    } catch (error) {
      throw error;
    }
  };

  //   let res1 = {};
  //   let res2 = {};
  //   let allRes = {};
  //   fetch(`${baseUrl}/projectInProgress`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("data >>> ", data);
  //       res1 = data;
  //     });
  //   fetch(`${baseUrl}/api/projectEnded/page/${pageNum}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("data >>> ", data);
  //       res2 = data;
  //       allRes = { projectInprogress: res1, projectEnded: res2 };
  //       console.log("allRes >>> ", allRes);
  //       dispatch(setProjectSlider(allRes));
  //     });
  // } catch (error) {
  //   throw error;
  // }
};
export const { setProjectSlider, removeProject } = productSliderSlice.actions;
export default productSliderSlice.reducer;
