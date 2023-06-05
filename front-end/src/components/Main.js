// import AdminPage from "./admin/adminPage";
// import { Route, Routes } from "react-router-dom";
// import Project from "./admin/manageProject/Project";
// import ManageLeader from "./admin/manageLeader/ManageLeader";
// import ManageStaff from "./admin/manageStaff/ManageStaff";
// import ViewDetailProject from "./admin/manageProject/ViewDetailProject";
// import { fetchProjects } from "../redux/ProjectSlider";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import LoginPage from "./loginPage/LoginPage";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import HomePage from "./HomePage";
// import TransferList from "./admin/manageProject/TransferMember";

// function Main(props) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const userLogin = useSelector((state) => state.userSlider);
//   const projects = useSelector((state) => state.projectSlider);
//   console.log("userLogin: ", userLogin);
//   const [allProjects, setAllProjects] = useState({});
//   useEffect(() => {
//     dispatch(fetchProjects(1));
//   }, []);

//   console.log("projects in app: ", projects);
//   console.log("allProjects: ", allProjects);
//   return (
//     <div className="App">
//       <div className="app-body">
//         <Routes>
//           <Route path="/admin" element={<AdminPage />}>
//             <Route
//               path="project"
//               element={<Project projects={projects} />}
//             ></Route>
//             <Route
//               path="project/:projectId"
//               element={<ViewDetailProject projects={projects} />}
//             />
//             <Route
//               path="project/transfer/:projectId"
//               element={<TransferList projects={projects} />}
//             />
//             <Route path="leader" element={<ManageLeader />} />
//             <Route path="staff" element={<ManageStaff />} />
//           </Route>
//           <Route path="/login" element={<LoginPage />}></Route>

//           <Route
//             path="*"
//             element={
//               <div>
//                 <h1>404 not found</h1>
//               </div>
//             }
//           />
//           <Route path="/" element={<HomePage userLogin={userLogin} />}></Route>
//         </Routes>
//       </div>
//       <div className="app-footer"></div>
//     </div>
//   );
// }

// export default Main;
