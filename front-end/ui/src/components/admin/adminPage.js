import NavLeftAdmin from "./NavLeftAdmin";
import { Outlet } from "react-router-dom";
import Project from "./manageProject/Project";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHeader from "../../contain/NavHeader";
function AdminPage(props) {
  console.log("props in adminPage: ", props);

  let navigate = useNavigate();
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
