import { useMemo, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Checkbox, Paper, TextField, Chip, Alert } from "@mui/material";
import { color, padding, width } from "@mui/system";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { Scrollbars } from "react-custom-scrollbars";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Code from "@mui/icons-material/Code";
import MenuFilterItem from "./MenuItems";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { useCookies } from "react-cookie";
import { searchStaff } from "../../../../services/adminServices/AdminServices";
import { advanceSearchProject } from "../../../../services/adminServices/AdminServices";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

const SearchDialog = (props) => {
  console.log("props", props);
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;

  const [searchModel, setSearchModel] = useState({
    projectName: "",
    PM: null,
    dev: [],
    BA: [],
    tester: [],
    startDate: "",
    endDate: "",
  });

  const [searchProjectResult, setSearchProjectResult] = useState([]);
  const [statusSearchProject, setStatusSearchProject] = useState({
    searching: false,
    err: false,
    errMessage: "",
  });

  const [SearchStaffResult, setSearchStaffResult] = useState({
    PM: [],
    dev: [],
    BA: [],
    tester: [],
  });

  const [resultChecked, setResultChecked] = useState({
    PM: [],
    dev: [],
    BA: [],
    tester: [],
  });
  const [searchContent, setSearchContent] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const typingTimeoutRef = useRef(null);
  const handleChangeField = (e) => {
    const { name, value } = e.target;
    console.log(name, ": ", value);
    let type = name;
    setSearchContent(value);
    setSearchItem(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      console.log("search content after 500ms: ", value);
      handleSetSearchModel(type, value);
    }, 500);
  };

  const handleSetResultChecked = async (type, value) => {
    if (type === "dev" || type === "BA" || type === "tester") {
      setResultChecked({
        ...resultChecked,
        [type]: value,
      });
      let temp = [];
      value.forEach((item) => {
        temp.push(item.StaffID);
      });
      handleSetSearchModel(type, temp);
    }

    if (type === "PM") {
      setResultChecked({
        ...resultChecked,
        [type]: value,
      });
      if (value.length === 0) {
        handleSetSearchModel(type, null);
      } else {
        handleSetSearchModel(type, value[0].StaffID);
      }
    }
  };

  const handleSearchProject = async (searchModel) => {
    let res = await advanceSearchProject(searchModel, token);
    console.log("res advanceSearchProject ", res);
    setSearchProjectResult(res.data);
    if (res.errCode === 0) {
      setStatusSearchProject({
        searching: false,
        err: false,
        errMessage: "",
      });
    } else {
      setStatusSearchProject({
        searching: false,
        err: true,
        errMessage: res.message,
      });
    }
  };

  const handleSetSearchModel = async (type, value) => {
    let subModel = { ...searchModel, [type]: value };
    console.log("subModel", subModel);

    setSearchModel({
      ...searchModel,
      [type]: value,
    });
    setStatusSearchProject({ ...statusSearchProject, searching: true });
    setTimeout(async () => {
      await handleSearchProject(subModel);
    }, 500);
  };

  const handleSearchStaff = async (searchInput, type) => {
    let res = await searchStaff(searchInput, type, token);
    console.log("res", res);
    if (res.errCode === 0) {
      setSearchStaffResult({ ...SearchStaffResult, [type]: res.data });
    }
  };

  const handleResetSearchResultStaff = (type) => {
    setSearchStaffResult({ ...SearchStaffResult, [type]: [] });
  };

  console.log("searchModel info>>", searchModel);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{"Search a project"}</DialogTitle>

        <DialogContent sx={{ width: "900px" }}>
          <div className="row d-flex">
            <div className="col-4" style={{ borderRight: "1px solid #101214" }}>
              <h6 style={{ color: "#1A2027" }}>Filter By</h6>
              <div className="filter-terms">
                {/* manager */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"PM"}
                    icon={<AccountBoxIcon />}
                    name={"Project Manager"}
                    searchResult={SearchStaffResult.PM}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.PM}
                    handleSearchStaff={handleSearchStaff}
                    handleResetSearchResultStaff={handleResetSearchResultStaff}
                    setEmptyCheckedPM={() => handleSetResultChecked("PM", [])}
                  />
                </div>
                {/* developer */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"dev"}
                    icon={<Code />}
                    name={"Software Developer"}
                    searchResult={SearchStaffResult.dev}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.dev}
                    handleSearchStaff={handleSearchStaff}
                    handleResetSearchResultStaff={handleResetSearchResultStaff}
                  />
                </div>
                {/* BA */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"BA"}
                    icon={<AnalyticsIcon />}
                    name={"Business Analysis"}
                    searchResult={SearchStaffResult.BA}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.BA}
                    handleSearchStaff={handleSearchStaff}
                    handleResetSearchResultStaff={handleResetSearchResultStaff}
                  />
                </div>
                {/* tester */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"tester"}
                    icon={<BugReportIcon />}
                    name={"Software tester"}
                    searchResult={SearchStaffResult.tester}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.tester}
                    handleSearchStaff={handleSearchStaff}
                    handleResetSearchResultStaff={handleResetSearchResultStaff}
                  />
                </div>

                {/* start day */}
                <div className="filter-item my-3">
                  <TextField
                    size="small"
                    type={"month"}
                    label={"Time start"}
                    variant="filled"
                    color="secondary"
                    name="startDate"
                    onChange={(e) => {
                      handleSetSearchModel(
                        e.target.name,
                        moment(e.target.value)
                          .startOf("month")
                          .format("YYYY-MM-DD")
                          .toString()
                      );
                    }}
                  ></TextField>
                </div>

                {/* end day */}
                <div className="filter-item my-3">
                  <TextField
                    size="small"
                    type={"month"}
                    label={"Time end"}
                    variant="filled"
                    name="endDate"
                    onChange={(e) => {
                      handleSetSearchModel(
                        e.target.name,
                        moment(e.target.value)
                          .endOf("month")
                          .format("YYYY-MM-DD")
                          .toString()
                      );
                    }}
                  ></TextField>
                </div>
              </div>
            </div>
            <div className="col-8">
              <TextField
                size="small"
                fullWidth
                label="Project name"
                variant="outlined"
                sx={{ mt: 1 }}
                name="projectName"
                value={searchContent}
                onChange={(e) => handleChangeField(e)}
              ></TextField>

              <div
                className="project-result "
                style={{
                  height: "100%",
                  overflowY: "scroll",
                  position: "relative",
                }}
              >
                {statusSearchProject.err === true && (
                  <Alert severity="warning" className="my-3">
                    {statusSearchProject.errMessage}
                  </Alert>
                )}
                {statusSearchProject.searching === true && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      position: "absolute",
                      top: "45%",
                      left: "50%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {statusSearchProject.err === false &&
                  searchProjectResult.map((item, index) => {
                    return (
                      <Box key={index} sx={{ cursor: "pointer" }}>
                        <Paper
                          elevation={4}
                          sx={{
                            my: 2,
                            mx: 1,
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          onClick={() => {
                            navigate(`/admin/project/${item.ProjectID}`);
                          }}
                        >
                          <b>
                            {item.ProjectName} (ID: {item.ProjectID})
                          </b>
                          <b>{item.Manager}</b>{" "}
                          {Date.parse(item.TimeStart) < Date.now() &&
                            Date.parse(item.TimeEnd) > Date.now() && (
                              <Chip
                                label="In progress"
                                color="warning"
                                variant="contained"
                              />
                            )}
                          {Date.parse(item.TimeEnd) < Date.now() && (
                            <Chip
                              label="Done"
                              color="success"
                              variant="contained"
                            />
                          )}
                          {Date.parse(item.TimeStart) > Date.now() && (
                            <Chip
                              label="Incoming"
                              color="info"
                              variant="contained"
                            />
                          )}
                        </Paper>
                      </Box>
                    );
                  })}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Disagree</Button>
          <Button onClick={props.handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
