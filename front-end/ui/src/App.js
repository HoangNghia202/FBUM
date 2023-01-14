import logo from "./logo.svg";
import "./App.scss";
import AdminPage from "./components/admin/adminPage";
import NavHeader from "./contain/NavHeader";
import { Route, Routes } from "react-router-dom";
import Project from "./components/admin/manageProject/Project";
import ManageLeader from "./components/admin/manageLeader/ManageLeader";
import ManageStaff from "./components/admin/manageStaff/ManageStaff";
import ViewDetailProject from "./components/admin/manageProject/ViewDetailProject";
import { dataProject } from "./components/admin/dataAdmin";
import { fetchProjects } from "./redux/ProductSlider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./components/loginPage/LoginPage";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.productSlider);
  const userLogin = useSelector((state) => state.userSlider);
  console.log("userLogin: ", userLogin);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);
  console.log("projects: ", projects);

  return (
    <div className="App">
      {/* <div className="app-nav">
        <NavHeader />
      </div> */}
      <div className="app-body">
        <Routes>
          <Route path="/admin" element={<AdminPage />}>
            <Route
              path="project"
              element={<Project projects={projects} />}
            ></Route>
            <Route
              path="project/:projectId"
              element={<ViewDetailProject projects={projects} />}
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
