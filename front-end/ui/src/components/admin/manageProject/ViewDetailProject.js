import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";
import StaffOfProject from "./StaffOfProject";
import "./viewDetailTable.scss";

function ViewDetailProject(props) {
  console.log("props", props);

  const { projectId } = useParams();
  console.log("projectId>>>", projectId);
  const { projects } = props;
  console.log("projects", projects);
  const mainProject = projects.filter((item) => item.id == projectId)[0];
  console.log("mainProject", mainProject);

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
        </div>
        <div className="col-md-8 mt-2 p-0">
          <StaffOfProject staffs={mainProject.staffs} />
        </div>
      </div>
    </div>
  );
}

export default ViewDetailProject;
