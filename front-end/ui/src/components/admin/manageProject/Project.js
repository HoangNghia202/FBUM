import React from "react";
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

function Project(props) {
  const { projects } = props;
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let inprogressPrj = [];
  let endedPrj = [];
  projects.map((item) => {
    if (Date.parse(item.workEnd) > Date.now()) {
      inprogressPrj.push(item);
    } else {
      endedPrj.push(item);
    }
  });

  console.log("inprogressPrj", inprogressPrj);
  console.log("endedPrj", endedPrj);

  const handleSubmitForm = (event) => {
    event.preventDefault();
    const values = {
      name: event.target.projectName.value,
      company: event.target.companyName.value,
      workStart: moment(event.target.startDay.value).format("MM-DD-YYYY"),
      workEnd: moment(event.target.endDay.value).format("MM-DD-YYYY"),
    };
    console.log("values", values);

    alert(JSON.stringify(values));
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
                <SearchAutoComplete searchData={inprogressPrj} />
              </div>
              <div className="processing-proj row d-flex">
                {inprogressPrj.map((item) => {
                  let percent = Math.floor(
                    ((Date.now() - Date.parse(item.workStart)) /
                      (Date.parse(item.workEnd) - Date.parse(item.workStart))) *
                      100
                  );

                  console.log("percent", percent);

                  return (
                    <div
                      className="col-2 col-md-3 row"
                      onClick={() => {
                        ViewDetailProject(item.id);
                      }}
                    >
                      <div className="container">
                        <div className="card ">
                          <div className="card-body">
                            <h5 className="card-title">{item.projectName}</h5>

                            <Progress
                              striped
                              animated
                              color="warning"
                              value={percent}
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
              <SearchAutoComplete searchData={endedPrj} />
              <div className="ended-proj row">
                <div className="processing-proj row d-flex">
                  {endedPrj.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="col-2 col-md-3 row"
                        onClick={() => {
                          ViewDetailProject(item.id);
                        }}
                      >
                        <div className="container">
                          <div className="card card-end">
                            <div className="card-body">
                              <h5 className="card-title">{item.projectName}</h5>
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
            <TabPanel value="3">Item Three</TabPanel>
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
            <TextField
              className="my-2"
              label="Company's name"
              variant="outlined"
              size="small"
              name="companyName"
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
