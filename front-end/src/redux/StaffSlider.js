import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_JSON_API;
const initialState = {
  allStaff: {},
  freeStaffs: {},
  inProjectStaffs: {},
  pageNumAllStaff: 0,
  pageNumFreeStaff: 0,
  pageNumInProjectStaff: 0,
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
    setPageNumAllStaff(state, action) {
      return { ...state, pageNumAllStaff: action.payload };
    },
    setPageNumFreeStaff(state, action) {
      return { ...state, pageNumFreeStaff: action.payload };
    },
    setPageNumInProjectStaff(state, action) {
      return { ...state, pageNumInProjectStaff: action.payload };
    },
  },
});

export const fetchAllStaff = (pageNum, token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchAllStaff");

    dispatch(setPageNumAllStaff(pageNum.data));
    const res = await axios.get(`${baseUrl}/api/staff/${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

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

export const fetchFreeStaff = (pageNum, token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchFreeStaff");
    const res = await axios.get(`${baseUrl}/api/staffFree/${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

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

export const fetchInProjectStaff = (pageNum, token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchInProcessStaff");
    const res = await axios.get(`${baseUrl}/api/allStaffInProject/${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

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

export const fetchPageNumOfStaff = (token) => {
  return async (dispatch) => {
    console.log("run in to thunk action creator for fetchPageNumOfStaff");
    const res1 = await axios.get(`${baseUrl}/api/staffPage`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(setPageNumAllStaff(res1.data));

    const res2 = await axios.get(`${baseUrl}/api/staffFreePage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setPageNumFreeStaff(res2.data));

    const res3 = await axios.get(`${baseUrl}/api/allStaffInProjectPage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setPageNumInProjectStaff(res3.data));
  };
};

export default StaffSlice.reducer;
export const {
  setAllStaff,
  setFreeStaff,
  setInProjectStaff,
  setPageNumAllStaff,
  setPageNumFreeStaff,
  setPageNumInProjectStaff,
} = StaffSlice.actions;
