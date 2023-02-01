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

const baseUrl = process.env.REACT_APP_JSON_API;
function ManageStaff(props) {
  const [value, setValue] = React.useState("1");
  const [selectType, setSelectType] = React.useState({
    selectTypeAllStaff: "1",
    selectTypeFreeStaff: "1",
    selectTypeInProjectStaff: "1",
  });

  const [allStaff, setAllStaff] = React.useState({
    allPM: [],
    allDev: [],
    allTester: [],
    allBA: [],
  });

  const [freeStaff, setFreeStaff] = React.useState({
    allPM: [],
    allDev: [],
    allTester: [],
    allBA: [],
  });

  const [inProjectStaff, setInProjectStaff] = React.useState({
    allPM: [],
    allDev: [],
    allTester: [],
    allBA: [],
  });

  const [show, setShow] = React.useState(false);
  const handleClose = () => React.setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const getAllStaff = async () => {
    let res = await axios.get(`${baseUrl}/api/staff`);
    console.log("res>>>", res.data);
    if (res.data) {
      let allPM = res.data.filter(
        (staff) => staff.StaffRole == "Project Manager"
      );
      let allDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let allTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let allBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );
      setAllStaff({
        allPM: allPM,
        allDev: allDev,
        allTester: allTester,
        allBA: allBA,
      });
    }
  };

  const getFreeStaffs = async () => {
    let res = await axios.get(`${baseUrl}/api/staffFree`);
    console.log("res>>>", res.data);
    if (res.data) {
      let freePM = res.data.filter(
        (staff) =>
          staff.StaffRole == "Project Manager" && staff.ProjectId == null
      );
      let freeDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let freeTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let freeBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );
      setFreeStaff({
        allPM: freePM,
        allDev: freeDev,
        allTester: freeTester,
        allBA: freeBA,
      });
    }
  };

  const getInProjectStaffs = async () => {
    let res = await axios.get(`${baseUrl}/api/staffInProject`);
    console.log("res>>>", res.data);
    if (res.data) {
      let inProjectPM = res.data.filter(
        (staff) => staff.StaffRole == "Project Manager"
      );
      let inProjectDev = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Software Developer"
      );
      let inProjectTester = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" && staff.MainPosition == "Software Tester"
      );
      let inProjectBA = res.data.filter(
        (staff) =>
          staff.StaffRole == "Staff" &&
          staff.MainPosition == "Business Analysis"
      );
      setInProjectStaff({
        allPM: inProjectPM,
        allDev: inProjectDev,
        allTester: inProjectTester,
        allBA: inProjectBA,
      });
    }
  };

  React.useEffect(() => {
    getAllStaff();
    getFreeStaffs();
    getInProjectStaffs();
  }, []);

  console.log("allStaff", allStaff);
  console.log("freeStaff", freeStaff);

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

  const handleSubmitForm = () => {};

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
              onClick={() => handleShow()}
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
                staffs={allStaff}
                selectType={selectType.selectTypeAllStaff}
                changeSelectType={handleChangeSelectType}
                itemType="allStaff"
              />
            }
          </TabPanel>
          <TabPanel value="2">
            {
              <TableStaff
                staffs={freeStaff}
                selectType={selectType.selectTypeFreeStaff}
                changeSelectType={handleChangeSelectType}
                itemType="freeStaff"
              />
            }
          </TabPanel>
          <TabPanel value="3">
            {
              <TableStaff
                staffs={inProjectStaff}
                selectType={selectType.selectTypeInProjectStaff}
                changeSelectType={handleChangeSelectType}
                itemType="inProjectStaff"
              />
            }
          </TabPanel>
        </TabContext>
      </Box>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(event) => handleSubmitForm(event)}>
            <div className="row">
              <div className="col-6">
                <TextField
                  className=" my-2"
                  label="Staff Name"
                  variant="outlined"
                  size="small"
                  name="projectName"
                  fullWidth
                />
              </div>
              <div className="col-6">
                <TextField
                  className=" my-2"
                  label="Password"
                  variant="outlined"
                  size="small"
                  name="projectName"
                  fullWidth
                  type={"password"}
                />
              </div>

              <div className="row my-3 text-center">
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Role</b>{" "}
                  </label>
                  <select class="form-select">
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Main Position</b>{" "}
                  </label>
                  <select class="form-select">
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="col-4">
                  <label>
                    {" "}
                    <b>Level</b>{" "}
                  </label>
                  <select class="form-select">
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ManageStaff;
