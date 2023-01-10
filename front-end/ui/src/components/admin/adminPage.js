import NavLeftAdmin from "./NavLeftAdmin";
import { Outlet } from "react-router-dom";
import Project from "./manageProject/Project";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function AdminPage() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/project");
  }, []);
  return (
    <div className="row">
      <NavLeftAdmin />
      <Outlet />
    </div>
  );
}

export default AdminPage;
