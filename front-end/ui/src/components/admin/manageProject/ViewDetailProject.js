import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";
import StaffOfProject from "./StaffOfProject";
import "./viewDetailTable.scss";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  handleDeleteProject,
  handleRemoveStaffOutOfProject,
} from "../../../services/adminServices/AdminServices";
import { fetchProjects } from "../../../redux/ProjectSlider";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { exportExcel } from "../../../services/adminServices/AdminServices";

function ViewDetailProject(props) {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;
  console.log("props", props);
  const { projectEnded, projectInprogress, projectIncoming } = props.projects;
  let navigate = useNavigate();
  const { projectId } = useParams();
  console.log("projectId>>>", projectId);

  const handleClickExport = async (projectId) => {
    let path = "h";
    console.log("click export");
    let res = await exportExcel(projectId, path, token);
    console.log("res", res);
    if (res.errCode === 0) {
      toast.success("Export excel successfully!");
    } else {
      console.log("error", res);
      toast.error("Export excel failed!");
    }
  };

  const mainProject = [
    ...projectEnded,
    ...projectInprogress,
    ...projectIncoming,
  ].filter((item) => item.ProjectID == projectId)[0];

  const [type, setType] = useState("");
  useEffect(() => {
    if (Date.parse(mainProject.TimeEnd) > Date.now()) {
      if (Date.parse(mainProject.TimeStart) > Date.now()) {
        setType("incoming");
      } else {
        setType("inprogress");
      }
    } else {
      setType("ended");
    }
  }, [mainProject]);

  console.log("mainProject", mainProject);

  const handleTransferMember = (projectId) => {
    navigate(`/admin/project/transfer/${projectId}`);
    console.log("projectId need to transfer>>", projectId);
  };

  const handleClickDelete = async (projectId) => {
    console.log("click delete");
    let confirm = window.confirm("Are you sure to delete this project?");
    if (confirm) {
      const res = await handleDeleteProject(projectId, token);
      console.log("res", res);
      if (res.errCode === 0) {
        navigate("/admin/project");
        dispatch(fetchProjects(1, token));
      } else {
        console.log("error", res);
        toast.error(res.message);
      }
    }
  };

  const removeStaffOutOfProject = async (staffId) => {
    console.log("remove staff out of project", staffId);
    let confirm = window.confirm(
      "Are you sure to remove this staff out of project?"
    );
    if (confirm) {
      let res = await handleRemoveStaffOutOfProject(staffId, projectId, token);
      if (res.errCode === 0) {
        toast.success("Remove staff out of project successfully!");
        dispatch(fetchProjects(1, token));
      } else {
        console.log("error", res);
        toast.error("Remove staff out of project failed!");
      }
    }
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
          <h4>{mainProject.ProjectName}</h4>
          <hr></hr>
          <h5>Project Manager:{mainProject.Manager} </h5>
          <h5>
            Start Date: {moment(mainProject.TimeStart).format("MM/DD/YYYY")}
          </h5>

          <h5>End Date:{moment(mainProject.TimeEnd).format("MM/DD/YYYY")}</h5>
          <hr></hr>
          <div className="justify-content-around">
            <Button
              variant="contained"
              color="success"
              className="my-1"
              onClick={() => {
                navigate(`/admin/project/addStaffsToProject/${projectId}`);
              }}
            >
              Add Member
            </Button>
            {Date.parse(mainProject.TimeEnd) > Date.now() &&
              Date.parse(mainProject.TimeStart) > Date.now() && (
                <Button
                  variant="contained"
                  color="error"
                  className="my-1"
                  onClick={() => handleClickDelete(projectId)}
                >
                  Delete project
                </Button>
              )}
            <Button
              variant="contained"
              color="warning"
              className="my-1"
              onClick={() => handleTransferMember(mainProject.ProjectID)}
            >
              Transfer Member
            </Button>

            <Button
              variant="contained"
              color="warning"
              className="my-1"
              onClick={() => handleClickExport(mainProject.ProjectID)}
            ></Button>
          </div>
        </div>
        <div className="col-md-8 mt-2 p-0">
          <StaffOfProject
            staffs={mainProject.Staffs}
            removeStaffOutOfProject={removeStaffOutOfProject}
            type={type}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewDetailProject;
