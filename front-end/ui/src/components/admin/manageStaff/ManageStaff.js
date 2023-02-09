import "./manageStaff.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-bootstrap/Modal";
import TableStaff from "./TableStaff";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";

import { Cookies, useCookies } from "react-cookie";

import {
  fetchAllStaff,
  fetchInProjectStaff,
  fetchFreeStaff,
} from "../../../redux/StaffSlider";
import {
  handleCreateNewStaff,
  handleDeleteStaff,
} from "../../../services/adminServices/AdminServices";
import { toast } from "react-toastify";
const baseUrl = process.env.REACT_APP_JSON_API;
function ManageStaff(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;
  const { staffs } = props;
  const dispatch = useDispatch();
  console.log("prop in manage staff: ", staffs);

  const [value, setValue] = React.useState("1");
  const [callUseEffect, setCallUseEffect] = React.useState(1);
  const [selectType, setSelectType] = React.useState({
    selectTypeAllStaff: "1",
    selectTypeFreeStaff: "1",
    selectTypeInProjectStaff: "1",
  });

  const [newStaff, setNewStaff] = React.useState({
    StaffName: "",
    Password: "",
    ConfirmPassword: "",
    StaffRole: "1",
    MainPosition: "1",
    Level: "1",
  });

  const [errValidate, setErrValidate] = React.useState({ errMessage: "" });

  const handleConfirmPassword = () => {
    if (newStaff.Password !== newStaff.ConfirmPassword) {
      setErrValidate({
        errMessage: "Password and confirm password are not match",
      });
    } else {
      setErrValidate({ errMessage: "" });
    }
  };

  const [showCreate, setShowCreate] = React.useState(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);

  const handleChangeInputModal = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value,
    });
  };
  console.log("newStaff>>>", newStaff);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeSelectType = (item, valueSelect) => {
    console.log("item", item);
    console.log("valueSelect", valueSelect);
    switch (item) {
      case "allStaff":
        setSelectType({
          ...selectType,
          selectTypeAllStaff: valueSelect,
        });
        break;

      case "freeStaff":
        setSelectType({
          ...selectType,
          selectTypeFreeStaff: valueSelect,
        });
        break;

      case "inProjectStaff":
        setSelectType({
          ...selectType,
          selectTypeInProjectStaff: valueSelect,
        });
        break;

      default:
        break;
    }
  };

  const createNewStaff = async () => {
    console.log("run into createNewStaff");

    // delete newStaff.ConfirmPassword;
    console.log("newStaff>>>", newStaff);
    let res = await handleCreateNewStaff(newStaff, token);
    console.log("res>>>", res);
    if (res.errCode === 0) {
      toast.success(res.message);
      handleCloseCreate();
      setNewStaff({
        StaffName: "",
        Password: "",
        ConfirmPassword: "",
        StaffRole: "1",
        MainPosition: "1",
        Level: "1",
      });
      dispatch(fetchAllStaff(1, token));
      dispatch(fetchFreeStaff(1, token));
      dispatch(fetchInProjectStaff(1, token));
    } else {
      toast.error(res.message);
    }
  };

  const deleteStaff = async (id) => {
    let res = await handleDeleteStaff(id, token);
    if (res.errCode === 0) {
      toast.success(res.message);
      dispatch(fetchAllStaff(1, token));
      dispatch(fetchFreeStaff(1, token));
      dispatch(fetchInProjectStaff(1, token));
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="manage-project col-9">
      <div className="sticky-btn">
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Tooltip
            title="Add new staff"
            color="secondary"
            placement="left"
            variant={"soft"}
          >
            <Fab
              size="small"
              color="secondary"
              aria-label="add"
              onClick={() => handleShowCreate()}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </div>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              // position: "sticky",
              // top: "100px",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All Staff" value="1" />
              <Tab label="Free Staff" value="2" />
              <Tab label="In project staff" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {
              <TableStaff
                staffs={staffs.allStaff}
                selectType={selectType.selectTypeAllStaff}
                changeSelectType={handleChangeSelectType}
                itemType="allStaff"
              />
            }
          </TabPanel>
          <TabPanel value="2">
            {
              <TableStaff
                staffs={staffs.freeStaffs}
                selectType={selectType.selectTypeFreeStaff}
                changeSelectType={handleChangeSelectType}
                itemType="freeStaff"
                deleteStaff={(id) => deleteStaff(id)}
              />
            }
          </TabPanel>
          <TabPanel value="3">
            {
              <TableStaff
                staffs={staffs.inProjectStaffs}
                selectType={selectType.selectTypeInProjectStaff}
                changeSelectType={handleChangeSelectType}
                itemType="inProjectStaff"
                deleteStaff={(id) => deleteStaff(id)}
              />
            }
          </TabPanel>
        </TabContext>
      </Box>

      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Create new staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-12">
                <TextField
                  className=" my-2"
                  label="Staff Name"
                  variant="outlined"
                  size="small"
                  name="StaffName"
                  fullWidth
                  value={newStaff.StaffName}
                  onChange={(event) => handleChangeInputModal(event)}
                />
              </div>
              <div className="col-12">
                <TextField
                  className=" my-2"
                  label="Password"
                  variant="outlined"
                  size="small"
                  name="Password"
                  fullWidth
                  type={"password"}
                  value={newStaff.Password}
                  onChange={(event) => handleChangeInputModal(event)}
                />
              </div>

              <div className="col-12">
                <TextField
                  className=" my-2"
                  label="Confirm Password"
                  variant="outlined"
                  size="small"
                  name="ConfirmPassword"
                  fullWidth
                  type={"password"}
                  value={newStaff.ConfirmPassword}
                  onChange={(event) => handleChangeInputModal(event)}
                  onBlur={() => handleConfirmPassword()}
                />
              </div>
              <div className="col-12 mt-1">
                {errValidate && errValidate.errMessage && (
                  <Alert severity="error"> {errValidate.errMessage} </Alert>
                )}
              </div>

              <div className="row my-3 text-center">
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Role</b>{" "}
                  </label>
                  <select
                    class="form-select"
                    name="StaffRole"
                    onChange={(event) => handleChangeInputModal(event)}
                    value={newStaff.StaffRole}
                  >
                    <option value="1">Admin</option>
                    <option value="2">Project Manager</option>
                    <option value="3">Staff</option>
                  </select>
                </div>
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Main Position</b>{" "}
                  </label>
                  <select
                    class="form-select"
                    name="MainPosition"
                    value={newStaff.MainPosition}
                    onChange={(event) => handleChangeInputModal(event)}
                  >
                    <option value="1">Business Analysis</option>
                    <option value="2">Software Developer</option>
                    <option value="3">Software Tester</option>
                  </select>
                </div>
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Level</b>{" "}
                  </label>
                  <select
                    class="form-select"
                    name="Level"
                    value={newStaff.Level}
                    onChange={(event) => handleChangeInputModal(event)}
                  >
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
          <div>
            <Button
              variant="contained"
              color="success"
              className="mt-3"
              disabled={errValidate.errMessage ? true : false}
              onClick={() => createNewStaff()}
            >
              Create
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ManageStaff;
