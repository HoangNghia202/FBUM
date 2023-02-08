import NavLeftAdmin from "./NavLeftAdmin";
import { Outlet } from "react-router-dom";
import Project from "./manageProject/Project";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHeader from "../../contain/NavHeader";
import { fetchProjects } from "../../redux/ProjectSlider";
import { useDispatch } from "react-redux";
import {
  fetchAllStaff,
  fetchInProjectStaff,
  fetchFreeStaff,
} from "../../redux/StaffSlider";

import { Cookies, useCookies } from "react-cookie";

function AdminPage(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  console.log("props in adminPage: ", props);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  console.log("cookies in adminPage: ", cookies);
  const token = cookies.token;

  useEffect(() => {
    dispatch(fetchProjects(1, token));
    dispatch(fetchAllStaff(token));
    dispatch(fetchInProjectStaff(token));
    dispatch(fetchFreeStaff(token));
  }, []);

  useEffect(() => {
    navigate("/admin/project");
  }, []);
  return (
    <div className="row" style={{ marginTop: "5%" }}>
      <div className="app-nav">
        <NavHeader userInfo={props.userInfo} />
      </div>
      <NavLeftAdmin />
      <div className="col-3"></div>
      <Outlet />
    </div>
  );
}

export default AdminPage;
