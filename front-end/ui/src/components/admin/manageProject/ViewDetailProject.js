import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";
import StaffOfProject from "./StaffOfProject";
import "./viewDetailTable.scss";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
function ViewDetailProject(props) {
  const projects = useSelector((state) => state.projectSlider);
  let navigate = useNavigate();
  console.log("props", props);
  const { projectId } = useParams();
  console.log("projectId>>>", projectId);

  const mainProject = [
    ...projects.projectEnded,
    ...projects.projectInprogress,
  ].filter((item) => item.id == projectId)[0];
  console.log("mainProject", mainProject);

  const handleTransferMember = (projectId) => {
    console.log("projectId need to transfer>>", projectId);
    navigate(`/admin/project/transfer/${projectId}`);
  };
  return (
    <div className="col-9 wrapper-staffs p-5">
      <div
        className="row container border"
        style={{ backgroundColor: "#A472FE", borderRadius: "10px" }}
      >
        <div
          className="col-md-4 mt-2 text-white"
          style={{ backgroundColor: "#A472FE", textAlign: "left" }}
        >
          <h4>{mainProject.projectName}</h4>
          <hr></hr>
          <h5>Project Manager: {mainProject.projectManager}</h5>
          <h5>Start Date: {mainProject.workStart}</h5>
          <h5>End Date: {mainProject.workEnd}</h5>
          <hr></hr>
          <div className="justify-content-around">
            <Button variant="contained" color="success" className="my-2">
              Add Member
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleTransferMember(mainProject.id)}
            >
              Transfer Member
            </Button>
          </div>
        </div>
        <div className="col-md-8 mt-2 p-0">
          <StaffOfProject staffs={mainProject.staffs} />
        </div>
      </div>
    </div>
  );
}

export default ViewDetailProject;
