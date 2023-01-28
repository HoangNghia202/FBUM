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
import HomePage from "./components/HomePage";
import TransferList from "./components/admin/manageProject/TransferMember";
import AddStaffsToProject from "./components/admin/manageProject/AddStaffsToProject";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userSlider);
  const projects = useSelector((state) => state.projectSlider);
  const [allProjects, setAllProjects] = useState();
  console.log("userLogin: ", userLogin);
  useEffect(() => {
    dispatch(fetchProjects(1));
  }, []);
  console.log("projects in app: ", projects);

  return (
    <div className="App">
      <div className="app-body">
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

            <Route path="leader" element={<ManageLeader />} />
            <Route path="staff" element={<ManageStaff />} />
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
      </div>
      <div className="app-footer"></div>
    </div>
  );
}
export default App;
