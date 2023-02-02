import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import SearchAutoComplete from "./SearchAutoComplete";
function TableStaff(props) {
  console.log("props>>>>", props);
  const { staffs, selectType, changeSelectType, itemType, deleteStaff } = props;
  const [listStaffsToDisPlay, setListStaffsToDisPlay] = useState([]);
  const [staffsToDisPlay, setStaffsToDisPlay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

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
  }, [selectType]);
  console.log("staffsToDisPlay", staffsToDisPlay);

  // const searchData = [
  //   { id: 1, name: "Nguyen Van A", position: "Developer", level: "3" },
  //   { id: 2, name: "Nguyen Van B", position: "Developer", level: "3" },
  // ];

  useEffect(() => {
    setSearchData(listStaffsToDisPlay);
  }, [listStaffsToDisPlay]);

  const [data, setData] = useState(props.staffs);
  const showResult = (result) => {
    setStaffsToDisPlay(result);
    setSearchResult(result);
  };

  const viewAll = () => {
    setStaffsToDisPlay(listStaffsToDisPlay);
    setSearchResult([]);
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
            {(itemType === "freeStaff" || itemType === "inProjectStaff") && (
              <th scope="col">Action</th>
            )}
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default TableStaff;
