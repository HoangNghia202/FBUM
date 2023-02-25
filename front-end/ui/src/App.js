import "./App.scss";
import AdminPage from "./components/admin/adminPage";

import { Route, Routes } from "react-router-dom";
import Project from "./components/admin/manageProject/Project";
import ManageLeader from "./components/admin/manageLeader/ManageLeader";
import ManageStaff from "./components/admin/manageStaff/ManageStaff";
import ViewDetailProject from "./components/admin/manageProject/ViewDetailProject";

import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./components/loginPage/LoginPage";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage";
import TransferList from "./components/admin/manageProject/TransferMember";
import AddStaffsToProject from "./components/admin/manageProject/AddStaffsToProject";
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
  return (
    <div className="App">
      <div className="app-body">
        <Routes>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="project" element={<Project />}></Route>
            <Route path="project/:projectId" element={<ViewDetailProject />} />
            <Route
              path="project/transfer/:projectId"
              element={<TransferList />}
            />

            <Route
              path="project/addStaffsToProject/:projectId"
              element={<AddStaffsToProject />}
            />
            <Route path="staff" element={<ManageStaff />} />
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
            <Route
              path="addStaff/:projectId"
              element={<AddStaffsToProject />}
            />
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
