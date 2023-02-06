import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import { Button } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import SearchAutoComplete from "./SearchAutoComplete";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { handleUpdateStaff } from "../../../services/adminServices/AdminServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
  fetchAllStaff,
  fetchInProjectStaff,
  fetchFreeStaff,
} from "../../../redux/StaffSlider";

function TableStaff(props) {
  console.log("props in table staff>>>>", props);
  // console.log(
  //   "props in table staff > allPM>>>>",
  //   props.staffs.allPM.find((item) => item.StaffID === 5)
  // );

  const dispatch = useDispatch();
  const { staffs, selectType, changeSelectType, itemType, deleteStaff } = props;
  const [listStaffsToDisPlay, setListStaffsToDisPlay] = useState([]);
  const [staffsToDisPlay, setStaffsToDisPlay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);

  useEffect(() => {
    if (selectType === "1") {
      setListStaffsToDisPlay(staffs.allPM);
      setStaffsToDisPlay(staffs.allPM);
    } else if (selectType === "2") {
      setListStaffsToDisPlay(staffs.allDev);
      setStaffsToDisPlay(staffs.allDev);
    } else if (selectType === "3") {
      setListStaffsToDisPlay(staffs.allTester);
      setStaffsToDisPlay(staffs.allTester);
    } else if (selectType === "4") {
      setListStaffsToDisPlay(staffs.allBA);
      setStaffsToDisPlay(staffs.allBA);
    }
  }, [selectType, staffs]);
  console.log("staffsToDisPlay", staffsToDisPlay);

  useEffect(() => {
    setSearchData(listStaffsToDisPlay);
  }, [listStaffsToDisPlay]);

  const [data, setData] = useState(props.staffs);
  const showResult = (result) => {
    setStaffsToDisPlay(result);
    setSearchResult(result);
  };

  const [updateStaff, setUpdateStaff] = useState({});
  console.log("updateStaff", updateStaff);

  const handleChangeInputModal = (e) => {
    const { name, value } = e.target;
    setUpdateStaff({
      ...updateStaff,
      [name]: value,
    });
  };

  const viewAll = () => {
    setStaffsToDisPlay(listStaffsToDisPlay);
    setSearchResult([]);
  };

  const handleClickUpdate = (staff) => {
    let mainPosition = "";
    let staffRole = "";
    let level = "";
    switch (staff.MainPosition) {
      case "Software Tester":
        mainPosition = "3";
        break;
      case "Software Developer":
        mainPosition = "2";
        break;
      case "Business Analysis":
        mainPosition = "1";
        break;
      default:
        break;
    }
    switch (staff.StaffRole) {
      case "Staff":
        staffRole = "3";
        break;
      case "Project Manager":
        staffRole = "2";
        break;

      default:
        break;
    }

    level = staff.Level.toString();
    setUpdateStaff({
      ...staff,
      MainPosition: mainPosition,
      StaffRole: staffRole,
      Level: level,
    });
    handleShowUpdate();
  };

  const handleUpdate = async () => {
    console.log("updateStaff", updateStaff);
    let res = await handleUpdateStaff(updateStaff);
    if (res.errCode === 0) {
      toast.success(res.message);
      dispatch(fetchAllStaff());
      dispatch(fetchFreeStaff());
      dispatch(fetchInProjectStaff());
      handleCloseUpdate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      {searchResult.length > 0 && (
        <div className="sticky-btn">
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <Tooltip
              title="View All"
              color="secondary"
              placement="top"
              variant={"soft"}
            >
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                onClick={() => viewAll()}
              >
                <GridOnRoundedIcon />
              </Fab>
            </Tooltip>
          </Box>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <select
          class="form-select form-select-md "
          aria-label=".form-select-lg example"
          style={{ width: "200px" }}
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            changeSelectType(itemType, e.target.value);
          }}
          value={selectType}
        >
          <option checked value="1">
            Project Manager
          </option>
          <option value="2">Software Developer</option>
          <option value="3">Software Tester</option>
          <option value="4">Business Analysis</option>
        </select>
        <SearchAutoComplete
          searchData={searchData}
          showResult={(searchResult) => {
            showResult(searchResult);
          }}
        />
      </div>

      <table
        class="table table-striped table-hover"
        style={{ borderRadius: "10px" }}
      >
        <thead className="bg-dark text-white">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">level</th>

            <th scope="col">Action</th>

            {/* <th scope="col">Action</th> */}
          </tr>
        </thead>
        <tbody>
          {staffsToDisPlay.map((item, index) => {
            return (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{item.StaffID}</td>
                <td>{item.StaffName}</td>
                <td>{item.MainPosition}</td>
                <td>{item.Level}</td>
                {itemType === "freeStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        let confirm = window.confirm(
                          "Are you sure to delete this staff? "
                        );
                        if (confirm) {
                          deleteStaff(item.StaffID);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                )}

                {itemType === "inProjectStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        let confirm = window.confirm(
                          "Are you sure to delete this staff? This action will also delete this staff from project he/she is working on."
                        );
                        deleteStaff(item.StaffID);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                )}

                {itemType === "allStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        handleClickUpdate(item);
                      }}
                    >
                      Update
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal show={showUpdate} onHide={handleCloseUpdate} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Staff</Modal.Title>
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
                  value={updateStaff.StaffName}
                  onChange={(event) => handleChangeInputModal(event)}
                  autoFocus
                />
              </div>

              {/* <div className="col-12 mt-1">
                {errValidate && errValidate.errMessage && (
                  <Alert severity="error"> {errValidate.errMessage} </Alert>
                )}
              </div> */}

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
                    value={updateStaff.StaffRole}
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
                    value={updateStaff.MainPosition}
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
                    value={updateStaff.Level}
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
              // disabled={errValidate.errMessage ? true : false}
              onClick={() => {
                handleUpdate();
              }}
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TableStaff;
