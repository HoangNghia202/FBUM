import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useParams, useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import SearchAutoComplete from "./SearchAutoComplete";
import { searchProject } from "../../../services/adminServices/AdminServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../../redux/ProjectSlider";
import {
  getStaffsCanTransfer,
  getStaffAvailableBetweenTwoProject,
  transferStaffBetweenProject,
} from "../../../services/adminServices/AdminServices";

import { border } from "@mui/system";

const baseUrl = process.env.REACT_APP_JSON_API;

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  color: theme.palette.text.secondary,
  fontSize: border,
}));

export default function TransferList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //modal
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchResult, setSearchResult] = React.useState({});

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      console.log("search", e.target.value);

      handleShow();
      let result = await searchProject(e.target.value);
      setSearchResult(result);
    }
  };

  console.log("searchResult", searchResult);

  // end modal

  console.log("props", props);
  const { projects } = props;
  const { projectId } = useParams();
  console.log("projectId", projectId);
  const inprogressPrj = projects.projectInprogress;
  let fromProject = inprogressPrj.filter(
    (item) => item.ProjectID == projectId
  )[0];
  console.log("fromProject", fromProject);
  let restProject = inprogressPrj.filter((item) => item.ProjectID != projectId);
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  console.log("left", left);
  console.log("right", right);
  const [projectLeft, setProjectLeft] = React.useState([...left]);
  const [projectRight, setProjectRight] = React.useState([...right]);

  console.log("projectLeft", projectLeft);
  console.log("projectRight", projectRight);

  const [toProject, setToProject] = React.useState({});
  console.log("toProject", toProject);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleReset = () => {
    console.log("handleReset");
    setLeft([...projectLeft]);
    setRight([...projectRight]);
  };

  const chooseProjectRight = async (project) => {
    let staffsAvailableLeft = await getStaffAvailableBetweenTwoProject(
      fromProject.ProjectID,
      project.ProjectID
    );
    console.log("staffsAvailableLeft", staffsAvailableLeft.staffs);
    setLeft(staffsAvailableLeft.staffs);
    setProjectLeft(staffsAvailableLeft.staffs);

    let staffsAvailableRight = await getStaffAvailableBetweenTwoProject(
      project.ProjectID,
      fromProject.ProjectID
    );
    console.log("staffsAvailableRight", staffsAvailableRight.staffs);
    setRight(staffsAvailableRight.staffs);
    setProjectRight(staffsAvailableRight.staffs);

    setToProject(project);
    handleClose();
  };

  const handleSave = async () => {
    let rightToLeft = not(projectRight, right);
    let leftToRight = not(projectLeft, left);
    console.log("rightToLeft", rightToLeft);
    console.log("leftToRight", leftToRight);
    let idStaffsToLeft = rightToLeft.map((item) => item.StaffID).toString();
    let idStaffsToRight = leftToRight.map((item) => item.StaffID).toString();
    console.log("idStaffsToLeft", idStaffsToLeft);
    console.log("idStaffsToRight", idStaffsToRight);

    let confirm = window.confirm("Are you sure to save?");
    if (!confirm) {
      return;
    }

    if (idStaffsToLeft == "" && idStaffsToRight == "") {
      alert("No change for transfer staff between project");
      return;
    }

    if (idStaffsToLeft != "") {
      let res = await transferStaffBetweenProject(
        fromProject.ProjectID,
        toProject.ProjectID,
        idStaffsToLeft
      );
      console.log("res right to left>>>", res);
      if (res.errCode === 0) {
        alert("Transfer staff right to left project successfully");
      } else {
        alert("Transfer staff right to left project failed");
      }
    }
    if (idStaffsToRight != "") {
      let res = await transferStaffBetweenProject(
        toProject.ProjectID,
        fromProject.ProjectID,
        idStaffsToRight
      );
      console.log("res left to right>>>", res);
      if (res.errCode === 0) {
        alert("Transfer staff left to right project successfully");
      } else {
        alert("Transfer staff left to right project failed");
      }
    }

    dispatch(fetchProjects(1));
    navigate("/admin/project");
  };

  console.log("render");

  const customList = (items) => (
    <Paper sx={{ width: 300, height: 400, overflow: "auto" }}>
      <List dense component="div" role="list">
        <h3></h3>
        {items.map((value, index) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem key={index} role="listitem" onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.StaffName} (${value.MainPosition} ${value.Level})`}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        md={9}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <h6>From {fromProject.ProjectName}</h6>
          {customList(left)}
        </Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              color="warning"
              aria-label="Reset List"
              onClick={() => handleReset()}
            >
              reset
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              aria-label="Save List"
              color="success"
              onClick={handleSave}
            >
              save
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <div className="d-flex align-items-center my-2">
            <h6 className="px-1">To</h6>{" "}
            {/* <SearchAutoComplete
              searchData={restProject}
              setProject={(prj) => {
                setRight(prj.Staffs == null ? [] : prj.Staffs);
                setProjectRight(prj.Staffs == null ? [] : prj.Staffs);
              }}
            /> */}
            <Button color="warning" variant="outlined" onClick={handleShow}>
              {toProject && toProject.ProjectName
                ? toProject.ProjectName
                : "another project"}
            </Button>
          </div>
          {customList(right)}
        </Grid>
      </Grid>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Choose project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-5">
          <div className="row"></div>
          <TextField
            className=" my-2"
            label="Project name"
            variant="outlined"
            size="small"
            name="projectName"
            fullWidth
            onKeyDown={(event) => {
              handleSearch(event);
            }}
          />
          <Box sx={{ width: "100%" }}>
            {Object.keys(searchResult).length > 0 && (
              <Stack spacing={2}>
                {searchResult.errCode === 0 ? (
                  searchResult.projects.map((project, index) => {
                    return (
                      <Item sx={{ justifyContent: "start" }} key={index}>
                        <Box> {project.ProjectName} </Box>
                        <Box sx={{ float: "right", marginLeft: "auto" }}>
                          <Button
                            variant="contained"
                            disabled={
                              project.ProjectID == fromProject.ProjectID
                            }
                            onClick={() => chooseProjectRight(project)}
                          >
                            choose this
                          </Button>
                        </Box>
                      </Item>
                    );
                  })
                ) : (
                  <div className="alert alert-danger">
                    {searchResult.message}
                  </div>
                )}
              </Stack>
            )}
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
}
