import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import { Button, Paper } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import { useEffect, useRef, useState } from "react";
import SearchAutoComplete from "./SearchAutoComplete";
import TextField from "@mui/material/TextField";
import InfiniteScroll from "react-infinite-scroll-component";
import Alert from "@mui/material/Alert";

import { handleUpdateStaff } from "../../../services/adminServices/AdminServices";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SearchStaffResultTable from "./SearchStaffResultTable";
import DynamicSearchStaff from "./DynamicSearchStaff";

import {
  fetchAllStaff,
  fetchInProjectStaff,
  fetchFreeStaff,
} from "../../../redux/StaffSlider";
import { useCookies } from "react-cookie";
import { height } from "@mui/system";
import TableStaff from "./TableStaff";
import axios from "axios";
import {
  ConCatDataFetched,
  searchStaffByName,
} from "../../../services/adminServices/AdminServices";

const baseUrl = process.env.REACT_APP_JSON_API;
function ContentStaff(props) {
  console.log("props in content staff>>>>", props);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;

  const dispatch = useDispatch();
  const {
    staffs,
    selectType,
    changeSelectType,
    itemType,
    deleteStaff,
    totalPage,
  } = props;
  const [listStaffsToDisPlay, setListStaffsToDisPlay] = useState([]);
  const [staffsToDisPlay, setStaffsToDisPlay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [statusSearchStaff, setStatusSearchStaff] = useState({
    searchResult: [],
    message: "",
    keyword: "",
  });
  const [showUpdate, setShowUpdate] = useState(false);

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);

  // const [page, setPage] = useState({
  //   pageAllStaff: 1,
  //   pageFreeStaff: 1,
  //   pageInProjectStaff: 1,
  // });
  const [loading, setLoading] = useState(false);

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
    let res = await handleUpdateStaff(updateStaff, token);
    if (res.errCode === 0) {
      toast.success(res.message);
      dispatch(fetchAllStaff(1, token));
      dispatch(fetchFreeStaff(1, token));
      dispatch(fetchInProjectStaff(1, token));
      handleCloseUpdate(token);
    } else {
      toast.error(res.message);
    }
  };

  const handleLoadMoreData = async (page, selectType) => {
    let res = await ConCatDataFetched(page, itemType, selectType, token);
    console.log(" res>>>", res);
    if (res.errCode === 0) {
      setStaffsToDisPlay((prev) => [...prev, ...res.newData]);
      setListStaffsToDisPlay((prev) => [...prev, ...res.newData]);
      return { errCode: 0, message: res.message };
    } else {
      return { errCode: 1, message: res.message };
    }
  };

  const handleLoadMoreDataSearchStaff = async (
    itemType,
    selectType,
    name,
    page
  ) => {
    try {
      let res = await searchStaffByName(
        itemType,
        selectType,
        name,
        page,
        token
      );
      if (res.errCode === 0) {
        // concat data
        setStatusSearchStaff({
          ...statusSearchStaff,
          searchResult: [...statusSearchStaff.searchResult, ...res.data],
        });
        return { errCode: 0, message: res.message };
      } else {
        return { errCode: 1, message: res.message };
      }
    } catch (error) {
      console.error(error);
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
        {/* <SearchAutoComplete
          searchData={searchData}
          showResult={(searchResult) => {
            showResult(searchResult);
          }}
        /> */}
        <DynamicSearchStaff
          itemType={itemType}
          selectType={selectType}
          setStatusSearchStaff={(keyword, searchResult) => {
            setStatusSearchStaff({
              ...statusSearchStaff,
              keyword: keyword,
              searchResult: searchResult,
            });
          }}
          resetScreen={() => {
            setStatusSearchStaff({
              ...statusSearchStaff,
              searchResult: [],
              keyword: "",
            });
          }}
        />
      </div>

      {statusSearchStaff.searchResult.length > 0 ? (
        <SearchStaffResultTable
          staffsToDisPlay={statusSearchStaff.searchResult}
          itemType={itemType}
          deleteStaff={deleteStaff}
          handleClickUpdate={handleClickUpdate}
          selectType={selectType}
          handleLoadMoreData={handleLoadMoreDataSearchStaff}
          keyWord={statusSearchStaff.keyword}
          token={token}
        />
      ) : (
        <TableStaff
          staffsToDisPlay={staffsToDisPlay}
          itemType={itemType}
          deleteStaff={deleteStaff}
          handleClickUpdate={handleClickUpdate}
          totalPage={totalPage}
          selectType={selectType}
          handleLoadMoreData={handleLoadMoreData}
        />
      )}

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

export default ContentStaff;
