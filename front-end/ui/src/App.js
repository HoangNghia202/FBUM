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
function App() {
  return (
    <div className="App">
      <div className="app-nav">
        <NavHeader />
      </div>
      <div className="app-body">
        <Routes>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="project" element={<Project />}></Route>
            <Route
              path="project/:projectId"
              element={<ViewDetailProject projects={dataProject} />}
            />
            <Route path="leader" element={<ManageLeader />} />
            <Route path="staff" element={<ManageStaff />} />
          </Route>
          <Route
            path="*"
            element={
              <div>
                <h1>404 not found</h1>
              </div>
            }
          />
        </Routes>
      </div>
      <div className="app-footer"></div>
    </div>
  );
}
export default App;
