import { Outlet } from "react-router-dom";
import NavLeft from "./NavLeftPM";
import NavHeader from ".././../contain/NavHeader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
function PMPage(props) {
  const PMInfo = useSelector((state) => state.auth.authReducer.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (PMInfo.StaffRole !== "Project Manager") {
      navigate("/");
    }
  });
  return (
    <>
      <div style={{ marginBottom: "5rem" }}>
        <NavHeader />
      </div>
      <div className="row mx-0">
        <div className="col-3">
          <NavLeft />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default PMPage;
