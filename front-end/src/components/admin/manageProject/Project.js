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

import Modal from "react-bootstrap/Modal";
import { AlertTitle, Button, CircularProgress } from "@mui/material";
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
    setTabPanel,
} from "../../../redux/ProjectSlider";
import PaginationOutlined from "./Pagination";
import SearchAutoCompletePM from "./SearchAutoCompletePM";
import { toast } from "react-toastify";
import DynamicSearchProject from "./DynamicSearchProject";
import { useCookies } from "react-cookie";
import readXlsxFile from "read-excel-file";
import SearchDialog from "./searchProject/SearchDialog";
import { handleCreateNewStaff } from "../../../services/adminServices/AdminServices";
import { height } from "@mui/system";

function Project(props) {
    const currentUser = useSelector((state) => state.auth.authReducer.userInfo);
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.projectSlider.loading);
    console.log("loading project>>>> ", loading);

    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const token = cookies.token;
    const projects = useSelector((state) => state.projectSlider);

    const [projectEnded, setProjectEnded] = useState([]);
    const [projectInprogress, setProjectInprogress] = useState([]);
    const [projectIncoming, setProjectIncoming] = useState([]);

    const [projectEndedToDisPlay, setProjectEndedToDisPlay] = useState([]);
    const [projectInprogressToDisPlay, setProjectInprogressToDisPlay] =
        useState([]);
    const [projectIncomingToDisPlay, setProjectIncomingToDisPlay] = useState(
        []
    );

    const [startDayNewProject, setStartDayNewProject] = useState("");
    const [endDayNewProject, setEndDayNewProject] = useState("");
    const [FreeProjectManager, setFreeProjectManager] = useState([]);
    const [PMInNewProject, setPMInNewProject] = useState({});

    const [openSearchDialog, setOpenSearchDialog] = useState(false);
    const handleOpenSearchDialog = () => {
        setOpenSearchDialog(true);
    };
    const handleCloseSearchDialog = () => {
        setOpenSearchDialog(false);
    };

    useEffect(() => {
        if (currentUser.StaffRole !== "Admin") {
            navigate("/");
        }
    });

    useEffect(() => {
        setProjectEnded(projects.projectEnded);
        setProjectEndedToDisPlay(projects.projectEnded);
        setProjectInprogress(projects.projectInprogress);
        setProjectInprogressToDisPlay(projects.projectInprogress);
        setProjectIncoming(projects.projectIncoming);
        setProjectIncomingToDisPlay(projects.projectIncoming);
    }, [projects]);

    const handleChange = (event, newValue) => {
        dispatch(setTabPanel(newValue));
    };
    const value = projects.tabPanel;
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
            TimeEnd: moment(event.target.endDay.value).format(
                "YYYY-MM-DD hh:mm:ss"
            ),
            Manager: PMInNewProject.StaffID.toString(),
        };

        try {
            const res = await handleCreateProject(values, token);
            if (res.errCode === 0) {
                dispatch(fetchProjects(1, token));
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
        if (Date.parse(startDayNewProject) < Date.now()) {
            toast.error("Start day must be after today");
            return;
        }
        if (Date.parse(startDayNewProject) >= Date.parse(endDayNewProject)) {
            toast.error("Start day must be before end day");
            return;
        }

        let startDay = moment(startDayNewProject).format("YYYY-MM-DD hh:mm:ss");
        let endDay = moment(endDayNewProject).format("YYYY-MM-DD hh:mm:ss");
        let time = startDay + " , " + endDay;

        let res = await handleGetFreeProjectManager(time, token);
        if (res.errCode === 0) {
            console.log("Get free project manager successfully");
            setFreeProjectManager(res.PMs);
        } else {
            toast.error(res.message);
        }
    };

    // const handleChoseFile = async (event) => {
    //   const file = event.target.files[0];
    //   readXlsxFile(file).then((rows) => {
    //     rows.forEach(async (row) => {
    //       let staff = {
    //         StaffName: row[0],
    //         Password: row[1],
    //         StaffRole: row[2],
    //         MainPosition: row[3],
    //         Level: row[4],
    //       };
    //       await handleCreateNewStaff(staff, token);
    //     });
    //   });
    // };

    console.log("loading>>>", projects.loading);

    return (
        <>
            <div className="manage-project col-9 ">
                {/* <input
          type="file"
          id="input"
          onChange={(event) => {
            handleChoseFile(event);
          }}
        /> */}
                <SearchDialog
                    open={openSearchDialog}
                    handleClose={handleCloseSearchDialog}
                    handleOpen={handleCloseSearchDialog}
                />
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
                                    <Tab
                                        label="Project in progressing"
                                        value="1"
                                    />
                                    <Tab label="Project incoming" value="3" />
                                    <Tab label="Project ended" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={handleOpenSearchDialog}
                                        >
                                            Advanced Search
                                        </Button>
                                    </Box>
                                    <DynamicSearchProject
                                        setProject={(data) =>
                                            setProjectInprogressToDisPlay(data)
                                        }
                                        typeProject="projectInprogress"
                                        resetScreen={() => {
                                            setProjectInprogressToDisPlay(
                                                projectInprogress
                                            );
                                        }}
                                    ></DynamicSearchProject>
                                    {/* <Button color="danger" style={{ height: "40px" }}>
                  Clear
                </Button> */}
                                </div>

                                {loading && (
                                    <div>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <CircularProgress />
                                            <hr></hr>
                                        </div>
                                        <div>
                                            <h6
                                                className="text-center"
                                                style={{ color: "#428fda" }}
                                            >
                                                Loading project...
                                            </h6>
                                        </div>
                                    </div>
                                )}

                                <div className="processing-proj row d-flex flex-row align-items-stretch">
                                    {projectInprogressToDisPlay?.map((item) => {
                                        let percent = Math.floor(
                                            ((Date.now() -
                                                Date.parse(item.TimeStart)) /
                                                (Date.parse(item.TimeEnd) -
                                                    Date.parse(
                                                        item.TimeStart
                                                    ))) *
                                                100
                                        );

                                        return (
                                            <div
                                                className="col-2 col-md-4 row"
                                                onClick={() => {
                                                    ViewDetailProject(
                                                        item.ProjectID
                                                    );
                                                }}
                                            >
                                                <div className="container">
                                                    <div className="card ">
                                                        <div className="card-body">
                                                            <h5
                                                                className="card-title"
                                                                style={{
                                                                    height: "50px",
                                                                }}
                                                            >
                                                                {
                                                                    item.ProjectName
                                                                }
                                                            </h5>
                                                            <div className="row px-2 cart-content">
                                                                <div className="text-black row">
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            Project
                                                                            ID
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div className="col-6 text-end">
                                                                        {
                                                                            item.ProjectID
                                                                        }
                                                                    </div>
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            PM
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div
                                                                        className="col-6 text-end card-text text-truncate"
                                                                        style={{
                                                                            maxWidth:
                                                                                "500px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            item.Manager
                                                                        }
                                                                    </div>
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            Team
                                                                            size
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div className="col-6 text-end">
                                                                        {
                                                                            item
                                                                                .Staffs
                                                                                .length
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Progress
                                                                striped
                                                                animated
                                                                color="warning"
                                                                value={
                                                                    percent > 0
                                                                        ? percent
                                                                        : 0
                                                                }
                                                                className="my-3 mx-2"
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
                                            totalPage={
                                                projects.totalPageProjectInProgress
                                            }
                                            onChangePage={(pageNum) =>
                                                dispatch(
                                                    fetchProjectsInprogress(
                                                        pageNum,
                                                        token
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={handleOpenSearchDialog}
                                        >
                                            Advanced Search
                                        </Button>
                                    </Box>
                                    <DynamicSearchProject
                                        setProject={(data) =>
                                            setProjectIncomingToDisPlay(data)
                                        }
                                        typeProject="projectIncoming"
                                        resetScreen={() => {
                                            setProjectIncomingToDisPlay(
                                                projectIncoming
                                            );
                                        }}
                                    ></DynamicSearchProject>
                                </div>
                                <div className="incoming-proj row d-flex flex-row align-items-stretch">
                                    {projectIncomingToDisPlay.map((item) => {
                                        let percent = Math.floor(
                                            ((Date.now() -
                                                Date.parse(item.TimeStart)) /
                                                (Date.parse(item.TimeEnd) -
                                                    Date.parse(
                                                        item.TimeStart
                                                    ))) *
                                                100
                                        );

                                        return (
                                            <div
                                                className="col-2 col-md-4 row"
                                                onClick={() => {
                                                    ViewDetailProject(
                                                        item.ProjectID
                                                    );
                                                }}
                                            >
                                                <div className="container">
                                                    <div className="card ">
                                                        <div className="card-body">
                                                            <h5
                                                                className="card-incoming"
                                                                style={{
                                                                    height: "50px",
                                                                }}
                                                            >
                                                                {
                                                                    item.ProjectName
                                                                }
                                                            </h5>

                                                            <div className="row px-2 cart-content">
                                                                <div className="text-black row">
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            Project
                                                                            ID
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div className="col-6 text-end">
                                                                        {
                                                                            item.ProjectID
                                                                        }
                                                                    </div>
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            PM
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div
                                                                        className="col-6 text-end card-text text-truncate"
                                                                        style={{
                                                                            maxWidth:
                                                                                "500px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            item.Manager
                                                                        }
                                                                    </div>
                                                                    <div className="col-6">
                                                                        {" "}
                                                                        <b>
                                                                            Team
                                                                            size
                                                                        </b>{" "}
                                                                    </div>
                                                                    <div className="col-6 text-end">
                                                                        {
                                                                            item
                                                                                .Staffs
                                                                                .length
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* <Progress
                              striped
                              animated
                              color="warning"
                              value={percent > 0 ? percent : 0}
                              className="my-3 mx-2"
                            >
                              {percent}%
                            </Progress> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="d-flex justify-content-center my-5 col-md-11 ">
                                        <PaginationOutlined
                                            totalPage={
                                                projects.totalPageProjectIncoming
                                            }
                                            onChangePage={(pageNum) =>
                                                dispatch(
                                                    fetchProjectsIncoming(
                                                        pageNum,
                                                        token
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={handleOpenSearchDialog}
                                        >
                                            Advanced Search
                                        </Button>
                                    </Box>
                                    <DynamicSearchProject
                                        setProject={(data) =>
                                            setProjectEndedToDisPlay(data)
                                        }
                                        typeProject="projectEnded"
                                        resetScreen={() => {
                                            setProjectEndedToDisPlay(
                                                projectEnded
                                            );
                                        }}
                                    ></DynamicSearchProject>
                                </div>
                                <div className="ended-proj row">
                                    <div className="processing-proj row d-flex">
                                        {projectEndedToDisPlay.length === 0 && (
                                            <Alert
                                                severity="error"
                                                className="w-100"
                                            >
                                                <AlertTitle>Info</AlertTitle>
                                                <strong>
                                                    There is no project ended!
                                                </strong>
                                            </Alert>
                                        )}
                                        {projectEndedToDisPlay.length > 0 &&
                                            projectEndedToDisPlay.map(
                                                (item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="col-2 col-md-4 row row"
                                                            onClick={() => {
                                                                ViewDetailProject(
                                                                    item.ProjectID
                                                                );
                                                            }}
                                                        >
                                                            <div className="container">
                                                                <div className="card ">
                                                                    <div className="card-body">
                                                                        <h5
                                                                            className="card-end"
                                                                            style={{
                                                                                height: "50px",
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.ProjectName
                                                                            }
                                                                        </h5>

                                                                        <div className="row px-2 cart-content">
                                                                            <div className="text-black row">
                                                                                <div className="col-6">
                                                                                    {" "}
                                                                                    <b>
                                                                                        Project
                                                                                        ID
                                                                                    </b>{" "}
                                                                                </div>
                                                                                <div className="col-6 text-end">
                                                                                    {
                                                                                        item.ProjectID
                                                                                    }
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    {" "}
                                                                                    <b>
                                                                                        PM
                                                                                    </b>{" "}
                                                                                </div>
                                                                                <div
                                                                                    className="col-6 text-end card-text text-truncate"
                                                                                    style={{
                                                                                        maxWidth:
                                                                                            "500px",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        item.Manager
                                                                                    }
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    {" "}
                                                                                    <b>
                                                                                        Team
                                                                                        size
                                                                                    </b>{" "}
                                                                                </div>
                                                                                <div className="col-6 text-end">
                                                                                    {
                                                                                        item
                                                                                            .Staffs
                                                                                            .length
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* <Progress
                              striped
                              animated
                              color="warning"
                              value={percent > 0 ? percent : 0}
                              className="my-3 mx-2"
                            >
                              {percent}%
                            </Progress> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        <div className="d-flex justify-content-center my-5 col-md-11 ">
                                            <PaginationOutlined
                                                totalPage={
                                                    projects.totalPageProjectEnded
                                                }
                                                onChangePage={(pageNum) =>
                                                    dispatch(
                                                        fetchProjectsInprogress(
                                                            pageNum,
                                                            token
                                                        )
                                                    )
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
                                    defaultValue={new Date().toUTCString()}
                                    onChange={(event) => {
                                        setStartDayNewProject(
                                            event.target.value
                                        );
                                    }}
                                />

                                <TextField
                                    className="my-2"
                                    label="End day"
                                    variant="filled"
                                    size="small"
                                    name="endDay"
                                    type={"date"}
                                    defaultValue={new Date().toUTCString()}
                                    onChange={(event) => {
                                        setEndDayNewProject(event.target.value);
                                    }}
                                />
                            </div>
                            <div className="my-2">
                                <Button
                                    variant="contained"
                                    color="primary"
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
        </>
    );
}

export default Project;
