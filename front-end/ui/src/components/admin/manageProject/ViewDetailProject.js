import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";
import StaffOfProject from "./StaffOfProject";

function ViewDetailProject(props) {
  const { projectId } = useParams();
  console.log(projectId);

  const projects = props.projects;
  console.log("projects", projects);
  const mainProject = projects.filter((item) => item.id == projectId)[0];
  console.log("mainProject", mainProject);

  return (
    <div className="col-9">
      <div
        className="row container border"
        style={{ backgroundColor: "#A472FE", borderRadius: "10px" }}
      >
        <div
          className="col-md-4 mt-2 text-white"
          style={{ backgroundColor: "#A472FE" }}
        >
          <h4>{mainProject.projectName}</h4>
          <hr></hr>
          <h5>Start Date: {mainProject.dayStart}</h5>
          <h5>End Date: {mainProject.dayEnd}</h5>
        </div>
        <div className="col-md-8 mt-2 p-0">
          <StaffOfProject staff={mainProject} />
        </div>
      </div>
    </div>
  );
}

export default ViewDetailProject;
