import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Checkbox, Paper, TextField } from "@mui/material";
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

const SearchDialog = (props) => {
  console.log("props", props);
  const [searchModel, setSearchModel] = useState({
    projectName: "",
    PM: {},
    dev: [],
    BA: [],
    tester: [],
    startDate: "",
    endDate: "",
  });

  const searchResultModel = {
    PM: [
      {
        StaffName: "Nguyen Van A",
        StaffID: "NV001",
      },
      {
        StaffName: "Nguyen Van B",
        StaffID: "NV002",
      },
      { StaffName: "Nguyen Van C", StaffID: "NV003" },
      { StaffName: "Nguyen Van D", StaffID: "NV004" },
      { StaffName: "Nguyen Van E", StaffID: "NV005" },
      { StaffName: "Nguyen Van F", StaffID: "NV006" },
    ],
    dev: [
      { StaffName: "Nguyen Van dev1", StaffID: "dev1" },
      { StaffName: "Nguyen Van dev2", StaffID: "dev2" },
    ],
    BA: [
      { StaffName: "Nguyen Van BA1", StaffID: "BA1" },
      { StaffName: "Nguyen Van BA2", StaffID: "BA2" },
    ],
    tester: [
      {
        StaffName: "Nguyen Van tester1",
        StaffID: "tester1",
      },
      {
        StaffName: "Nguyen Van tester2",
        StaffID: "tester2",
      },
    ],
  };

  const [resultChecked, setResultChecked] = useState({
    PM: [],
    dev: [],
    BA: [],
    tester: [],
  });

  const handleSetSearchModel = (type, value) => {
    setSearchModel({
      ...searchModel,
      [type]: value,
    });
    handleSearchProject();
  };

  const handleSetResultChecked = (type, value) => {
    setResultChecked({
      ...resultChecked,
      [type]: value,
    });

    if (type === "dev" || type === "BA" || type === "tester") {
      let temp = [];
      value.forEach((item) => {
        temp.push(item.StaffID);
      });
      setSearchModel({
        ...searchModel,
        [type]: temp,
      });
      handleSearchProject();
    }

    if (type === "PM") {
      setSearchModel({
        ...searchModel,
        [type]: value[0].StaffID,
      });
    }
  };

  const handleSearchProject = () => {
    // setTimeout(() => {
    //   console.log("after 500ms search start");
    // }, 500);
    let myPromise = new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          console.log("after 500ms search start");
          resolve("success");
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
    myPromise.then((result) => {
      console.log("result", result);
    });
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
                    searchResult={searchResultModel.PM}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.PM}
                  />
                </div>
                {/* developer */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"dev"}
                    icon={<Code />}
                    name={"Software Developer"}
                    searchResult={searchResultModel.dev}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.dev}
                  />
                </div>
                {/* BA */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"BA"}
                    icon={<AnalyticsIcon />}
                    name={"Business Analysis"}
                    searchResult={searchResultModel.BA}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.BA}
                  />
                </div>
                {/* tester */}
                <div className="filter-item my-3">
                  <MenuFilterItem
                    type={"tester"}
                    icon={<BugReportIcon />}
                    name={"Software tester"}
                    searchResult={searchResultModel.tester}
                    setModel={handleSetSearchModel}
                    setResultChecked={handleSetResultChecked}
                    resultChecked={resultChecked.tester}
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
              ></TextField>
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
