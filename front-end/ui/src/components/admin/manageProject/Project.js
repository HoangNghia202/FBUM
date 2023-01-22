import React, { useEffect } from "react";
import "./Project.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/joy/Tooltip";
import TextField from "@mui/material/TextField";
import "@fontsource/public-sans";
import SearchAutoComplete from "./SearchAutoComplete";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment/moment";
import { dataProject } from "../dataAdmin";
import { Progress } from "reactstrap";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateProject } from "../../../services/adminServices/AdminServices";
import { fetchProjects } from "../../../redux/ProjectSlider";

function Project(props) {
  const dispatch = useDispatch();
  console.log("props >>>", props);
  const projects = props.projects;

  const [projectEnded, setProjectEnded] = useState([]);
  const [projectInprogress, setProjectInprogress] = useState([]);

  useEffect(() => {
    if (projects) {
      setProjectEnded(projects.projectEnded);
      setProjectInprogress(projects.projectInprogress);
    }
  }, [projects]);

  console.log("projectEnded", projectEnded);
  console.log("projectInprogress", projectInprogress);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState("1");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const values = {
      ProjectName: event.target.projectName.value,
      TimeStart: moment(event.target.startDay.value).format("YYYY-MM-DD"),
      TimeEnd: moment(event.target.endDay.value).format("YYYY-MM-DD"),
    };
    console.log("values", values);
    try {
      const res = await handleCreateProject(values);
      console.log("res>>>", res);
      if (res.errCode === 0) {
        dispatch(fetchProjects(1));
        console.log(
          "create project successfully, and go to fecth project again"
        );
        handleClose();
      } else {
        handleShow();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  let navigate = useNavigate();
  const ViewDetailProject = (id) => {
    console.log("id", id);
    navigate(`/admin/project/${id}`);
  };

  return (
    <div className="manage-project col-9 ">
      <div className="sticky-btn">
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Tooltip
            title="Add new project"
            color="info"
            placement="top"
            variant={"soft"}
          >
            <Fab
              size="small"
              color="secondary"
              aria-label="add"
              onClick={() => handleShow()}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </div>
      <div className="container row">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Project in progressing" value="1" />
                <Tab label="Project ended" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div>
                <SearchAutoComplete
                  searchData={props.projects.projectInprogress}
                  setProject={(data) => setProjectInprogress(data)}
                />
              </div>
              <div className="processing-proj row d-flex">
                {projectInprogress.map((item) => {
                  let percent = Math.floor(
                    ((Date.now() - Date.parse(item.TimeStart)) /
                      (Date.parse(item.TimeEnd) - Date.parse(item.TimeStart))) *
                      100
                  );

                  console.log("percent", percent);

                  return (
                    <div
                      className="col-2 col-md-3 row"
                      onClick={() => {
                        ViewDetailProject(item.ProjectID);
                      }}
                    >
                      <div className="container">
                        <div className="card ">
                          <div className="card-body">
                            <h5 className="card-title">{item.ProjectName}</h5>

                            <Progress
                              striped
                              animated
                              color="warning"
                              value={percent > 0 ? percent : 0}
                            >
                              {percent}%
                            </Progress>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabPanel>
            <TabPanel value="2">
              <SearchAutoComplete searchData={projectEnded} />
              <div className="ended-proj row">
                <div className="processing-proj row d-flex">
                  {projectEnded.length > 0 &&
                    projectEnded.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="col-2 col-md-3 row"
                          onClick={() => {
                            ViewDetailProject(item.ProjectID);
                          }}
                        >
                          <div className="container">
                            <div className="card card-end">
                              <div className="card-body">
                                <h5 className="card-title">
                                  {item.ProjectName}
                                </h5>
                                <hr className="m-0"></hr>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>

      {/* modal input create new project */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(event) => handleSubmitForm(event)}>
            <div className="row"></div>
            <TextField
              className=" my-2"
              label="Project name"
              variant="outlined"
              size="small"
              name="projectName"
              fullWidth
            />

            <div className="d-flex justify-content-between">
              <TextField
                className="my-2"
                label="Start day"
                variant="filled"
                size="small"
                name="startDay"
                type={"date"}
                defaultValue={new Date().toISOString().slice(0, 10)}
              />

              <TextField
                className="my-2"
                label="End day"
                variant="filled"
                size="small"
                name="endDay"
                type={"date"}
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="d-flex">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                variant="primary"
                onClick={handleClose}
                style={{
                  backgroundColor: "rgb(164,114,254)",
                  border: "none",
                  marginLeft: "2px",
                }}
                type="submit"
              >
                Create
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Project;
