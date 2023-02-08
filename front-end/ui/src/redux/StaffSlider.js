import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_JSON_API;
const initialState = {
  allStaff: {},
  freeStaffs: {},
  inProjectStaffs: {},
};

const StaffSlice = createSlice({
  name: "staffSlide",
  initialState,
  reducers: {
    setAllStaff(state, action) {
      return { ...state, allStaff: action.payload };
    },
    setFreeStaff(state, action) {
      return { ...state, freeStaffs: action.payload };
    },

    setInProjectStaff(state, action) {
      return { ...state, inProjectStaffs: action.payload };
    },
  },
});

export const fetchAllStaff = (token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchAllStaff", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await axios.get(`${baseUrl}/api/staff`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data) {
      let allPM = res.data.filter(
        (staff) => staff.StaffRole == "Project Manager"
      );
      let allDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let allTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let allBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );

      let data = {
        allPM: allPM,
        allDev: allDev,
        allTester: allTester,
        allBA: allBA,
      };

      dispatch(setAllStaff(data));
    }
  };
};

export const fetchFreeStaff = (token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchFreeStaff");
    const res = await axios.get(`${baseUrl}/api/staffFree`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data) {
      let allPM = res.data.filter(
        (staff) => staff.StaffRole == "Project Manager"
      );
      let allDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let allTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let allBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );

      let data = {
        allPM: allPM,
        allDev: allDev,
        allTester: allTester,
        allBA: allBA,
      };

      dispatch(setFreeStaff(data));
    }
  };
};

export const fetchInProjectStaff = (token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchInProcessStaff");
    const res = await axios.get(`${baseUrl}/api/staffInProject`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res inprogress staff>>>", res.data);
    if (res.data) {
      let allPM = res.data.filter(
        (staff) => staff.StaffRole == "Project Manager"
      );
      let allDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let allTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let allBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );

      let data = {
        allPM: allPM,
        allDev: allDev,
        allTester: allTester,
        allBA: allBA,
      };

      dispatch(setInProjectStaff(data));
    }
  };
};

export default StaffSlice.reducer;
export const { setAllStaff, setFreeStaff, setInProjectStaff } =
  StaffSlice.actions;
