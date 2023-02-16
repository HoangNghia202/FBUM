import logo from "./logo.svg";
import "./App.scss";
import AdminPage from "./components/admin/adminPage";

import { Route, Routes } from "react-router-dom";
import Project from "./components/admin/manageProject/Project";
import ManageLeader from "./components/admin/manageLeader/ManageLeader";
import ManageStaff from "./components/admin/manageStaff/ManageStaff";
import ViewDetailProject from "./components/admin/manageProject/ViewDetailProject";
import { dataProject } from "./components/admin/dataAdmin";
import { fetchProjects } from "./redux/ProjectSlider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./components/loginPage/LoginPage";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";
import HomePage from "./components/HomePage";
import CustomScrollbars from "./contain/CustomScrollBar";
import TransferList from "./components/admin/manageProject/TransferMember";
import AddStaffsToProject from "./components/admin/manageProject/AddStaffsToProject";
import {
  fetchAllStaff,
  fetchInProjectStaff,
  fetchFreeStaff,
} from "./redux/StaffSlider";
import PMPage from "./components/project mananger/PMPage";
import NowProject from "./components/project mananger/now project/Nowproject";
import IncomingProject from "./components/project mananger/incoming project/IncomingPorject";
import DetailIncomingProject from "./components/project mananger/incoming project/DetailIncomingProject";
import StaffPage from "./components/staff/StaffPage";
import YourProject from "./components/staff/YourProject";
import Profile from "./components/Profile";
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userSlider);
  const projects = useSelector((state) => state.projectSlider);
  const staffs = useSelector((state) => state.staffSlider);

  // console.log("userLogin: ", userLogin);
  // useEffect(() => {
  //   dispatch(fetchProjects(1));
  //   dispatch(fetchAllStaff());
  //   dispatch(fetchInProjectStaff());
  //   dispatch(fetchFreeStaff());
  // }, []);

  console.log("staffs in app: ", staffs);

  console.log("projects in app: ", projects);
  console.log(
    "projects in app >> inprogress >> project 3: ",
    projects.projectInprogress.find((item) => item.ProjectID === 3)
  );

  console.log(
    "projects in app >> incoming >> project 9: ",
    projects.projectIncoming.find((item) => item.ProjectID === 9)
  );

  return (
    <div className="App">
      <div className="app-body">
        {/* <CustomScrollbars style={{ height: "100vh", width: "100%" }}> */}
        <Routes>
          <Route
            path="/admin"
            element={<AdminPage userInfo={userLogin.userInfo} />}
          >
            <Route
              path="project"
              element={<Project projects={projects} />}
            ></Route>
            <Route
              path="project/:projectId"
              element={<ViewDetailProject projects={projects} />}
            />
            <Route
              path="project/transfer/:projectId"
              element={<TransferList projects={projects} />}
            />

            <Route
              path="project/addStaffsToProject/:projectId"
              element={<AddStaffsToProject projects={projects} />}
            />

            {/* <Route path="leader" element={<ManageLeader />} /> */}
            <Route path="staff" element={<ManageStaff staffs={staffs} />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/PM" element={<PMPage />}>
            <Route path="nowProject" element={<NowProject />} />
            <Route path="incomingProject" element={<IncomingProject />}></Route>
            <Route
              path="incomingProject/:projectID"
              element={<DetailIncomingProject />}
            />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/staff" element={<StaffPage />}>
            <Route path="profile" element={<Profile />} />
            <Route path="yourProject" element={<YourProject />} />
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>

          <Route
            path="*"
            element={
              <div>
                <h1>404 not found</h1>
              </div>
            }
          />
          <Route path="/" element={<HomePage userLogin={userLogin} />}></Route>
        </Routes>
        {/* </CustomScrollbars> */}
      </div>
      <div className="app-footer"></div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;
