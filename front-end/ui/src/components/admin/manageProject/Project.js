import React, { useEffect } from "react";
import "./Project.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import "@fontsource/public-sans";
import SearchAutoComplete from "./SearchAutoComplete";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AlertTitle } from "@mui/material";
import moment from "moment/moment";
import { dataProject } from "../dataAdmin";
import { Alert, Progress } from "reactstrap";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCreateProject,
  handleGetFreeProjectManager,
} from "../../../services/adminServices/AdminServices";
import {
  fetchProjects,
  fetchProjectsInprogress,
  fetchProjectsEnded,
  fetchProjectsIncoming,
} from "../../../redux/ProjectSlider";
import PaginationOutlined from "./Pagination";
import SearchAutoCompletePM from "./SearchAutoCompletePM";
import { toast } from "react-toastify";
import DynamicSearchProject from "./DynamicSearchProject";

function Project(props) {
  const dispatch = useDispatch();
  console.log("props >>>", props);
  const { projects } = props;

  const [projectEnded, setProjectEnded] = useState([]);
  const [projectInprogress, setProjectInprogress] = useState([]);
  const [projectIncoming, setProjectIncoming] = useState([]);

  const [projectEndedToDisPlay, setProjectEndedToDisPlay] = useState([]);
  const [projectInprogressToDisPlay, setProjectInprogressToDisPlay] = useState(
    []
  );
  const [projectIncomingToDisPlay, setProjectIncomingToDisPlay] = useState([]);
  const [startDayNewProject, setStartDayNewProject] = useState("");
  const [endDayNewProject, setEndDayNewProject] = useState("");
  const [FreeProjectManager, setFreeProjectManager] = useState([]);
  const [PMInNewProject, setPMInNewProject] = useState({});

  useEffect(() => {
    setProjectEnded(projects.projectEnded);
    setProjectEndedToDisPlay(projects.projectEnded);
    setProjectInprogress(projects.projectInprogress);
    setProjectInprogressToDisPlay(projects.projectInprogress);
    setProjectIncoming(projects.projectIncoming);
    setProjectIncomingToDisPlay(projects.projectIncoming);
  }, [projects]);

  console.log("projectEnded", projectEnded);
  console.log("projectInprogress", projectInprogress);
  console.log("projectIncoming", projectIncoming);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState("1");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const values = {
      ProjectName: event.target.projectName.value,
      TimeStart: moment(event.target.startDay.value).format(
        "YYYY-MM-DD hh:mm:ss"
      ),
      TimeEnd: moment(event.target.endDay.value).format("YYYY-MM-DD hh:mm:ss"),
      Manager: PMInNewProject.StaffID.toString(),
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
        setFreeProjectManager([]);
      } else {
        handleShow();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const navigate = useNavigate();
  const ViewDetailProject = (id) => {
    console.log("id", id);
    navigate(`/admin/project/${id}`);
  };

  const getFreeProjectManager = async () => {
    if (Date.parse(startDayNewProject) >= Date.parse(endDayNewProject)) {
      toast.error("Start day must be before end day");
      return;
    }
    let startDay = moment(startDayNewProject).format("YYYY-MM-DD hh:mm:ss");
    let endDay = moment(endDayNewProject).format("YYYY-MM-DD hh:mm:ss");
    let time = startDay + " , " + endDay;
    console.log("time", time);

    let res = await handleGetFreeProjectManager(time);
    console.log("res", res);
    if (res.errCode === 0) {
      console.log("Get free project manager successfully");
      setFreeProjectManager(res.PMs);
    } else {
      toast.error(res.message);
    }
  };

  console.log("FreeProjectManager >>> ", FreeProjectManager);
  console.log("PMInNewProject >>> ", PMInNewProject);
  console.log("startDayNewProject", startDayNewProject);
  console.log("endDayNewProject", endDayNewProject);

  return (
    <div className="manage-project col-9 ">
      <div className="sticky-btn">
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Tooltip
            title="Add new project"
            color="secondary"
            placement="left"
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
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Project in progressing" value="1" />
                <Tab label="Project incoming" value="3" />
                <Tab label="Project ended" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {projectInprogressToDisPlay.length < projectInprogress.length && (
                <div className="sticky-btn-viewAll">
                  <Box sx={{ "& > :not(style)": { m: 1 } }}>
                    <Tooltip
                      title="View All"
                      color="info"
                      placement="left"
                      variant={"soft"}
                    >
                      <Fab
                        size="small"
                        color="secondary"
                        aria-label="add"
                        onClick={() => {
                          setProjectInprogressToDisPlay(projectInprogress);
                        }}
                      >
                        <GridOnRoundedIcon />
                      </Fab>
                    </Tooltip>
                  </Box>
                </div>
              )}

              <div>
                {/* <SearchAutoComplete
                  searchData={props.projects.projectInprogress}
                  setProject={(data) => setProjectInprogressToDisPlay(data)}
                  typeProject="projectInprogress"
                  searchType="project"
                /> */}
                <DynamicSearchProject
                  setProject={(data) => setProjectInprogressToDisPlay(data)}
                  typeProject="projectInprogress"
                ></DynamicSearchProject>
              </div>
              <div className="processing-proj row d-flex flex-row align-items-stretch">
                {projectInprogressToDisPlay.map((item) => {
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
                            <h5
                              className="card-title"
                              style={{ height: "50px" }}
                            >
                              {item.ProjectName}
                            </h5>

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
                <div className="d-flex justify-content-center my-5 col-md-11 ">
                  <PaginationOutlined
                    totalPage={props.projects.totalPageProjectInProgress}
                    onChangePage={(pageNum) =>
                      dispatch(fetchProjectsInprogress(pageNum))
                    }
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel value="3">
              {projectIncomingToDisPlay.length < projectIncoming.length && (
                <div className="sticky-btn-viewAll">
                  <Box sx={{ "& > :not(style)": { m: 1 } }}>
                    <Tooltip
                      title="View All"
                      color="info"
                      placement="left"
                      variant={"soft"}
                    >
                      <Fab
                        size="small"
                        color="secondary"
                        aria-label="add"
                        onClick={() => {
                          setProjectIncomingToDisPlay(projectIncoming);
                        }}
                      >
                        <GridOnRoundedIcon />
                      </Fab>
                    </Tooltip>
                  </Box>
                </div>
              )}

              <div>
                <DynamicSearchProject
                  setProject={(data) => setProjectIncomingToDisPlay(data)}
                  typeProject="projectIncoming"
                ></DynamicSearchProject>
              </div>
              <div className="incoming-proj row d-flex flex-row align-items-stretch">
                {projectIncomingToDisPlay.map((item) => {
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
                        <div className="card card-incoming">
                          <div className="card-body">
                            <h5
                              className="card-title"
                              style={{ height: "50px" }}
                            >
                              {item.ProjectName}
                            </h5>

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
                <div className="d-flex justify-content-center my-5 col-md-11 ">
                  <PaginationOutlined
                    totalPage={props.projects.totalPageProjectIncoming}
                    onChangePage={(pageNum) =>
                      dispatch(fetchProjectsIncoming(pageNum))
                    }
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel value="2">
              {projectIncomingToDisPlay.length < projectIncoming.length && (
                <div className="sticky-btn-viewAll">
                  <Box sx={{ "& > :not(style)": { m: 1 } }}>
                    <Tooltip
                      title="View All"
                      color="info"
                      placement="left"
                      variant={"soft"}
                    >
                      <Fab
                        size="small"
                        color="secondary"
                        aria-label="add"
                        onClick={() => {
                          setProjectEndedToDisPlay(projectEnded);
                        }}
                      >
                        <GridOnRoundedIcon />
                      </Fab>
                    </Tooltip>
                  </Box>
                </div>
              )}

              <DynamicSearchProject
                setProject={(data) => setProjectEndedToDisPlay(data)}
                typeProject="projectEnded"
              ></DynamicSearchProject>
              <div className="ended-proj row">
                <div className="processing-proj row d-flex">
                  {projectEndedToDisPlay.length === 0 && (
                    <Alert severity="info" className="w-100">
                      <AlertTitle>Info</AlertTitle>
                      <strong>There is no project ended!</strong>
                    </Alert>
                  )}
                  {projectEndedToDisPlay.length > 0 &&
                    projectEndedToDisPlay.map((item, index) => {
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
                                <h5
                                  className="card-title"
                                  style={{ height: "70px" }}
                                >
                                  {item.ProjectName}
                                </h5>
                                <hr className="m-0"></hr>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div className="d-flex justify-content-center my-5 col-md-11 ">
                    <PaginationOutlined
                      totalPage={props.projects.totalPageProjectEnded}
                      onChangePage={(pageNum) =>
                        dispatch(fetchProjectsInprogress(pageNum))
                      }
                    />
                  </div>
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
                onChange={(event) => {
                  console.log("event", event.target.value);
                  setStartDayNewProject(event.target.value);
                }}
              />

              <TextField
                className="my-2"
                label="End day"
                variant="filled"
                size="small"
                name="endDay"
                type={"date"}
                defaultValue={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  console.log("event", event.target.value);
                  setEndDayNewProject(event.target.value);
                }}
              />
            </div>
            <div className="my-2">
              <Button
                variant="warning"
                onClick={() => getFreeProjectManager()}
                className="mr-2"
              >
                Find ProjectManager
              </Button>
            </div>

            <div className="d-flex justify-content-start">
              {FreeProjectManager.length > 0 && (
                <SearchAutoCompletePM
                  searchData={FreeProjectManager}
                  setManager={async (result) => {
                    console.log("result", result);
                    setPMInNewProject(result);
                  }}
                />
              )}
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
