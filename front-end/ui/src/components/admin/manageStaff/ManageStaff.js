import "./manageStaff.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TableStaff from "./TableStaff";
function ManageStaff(props) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="manage-project col-9">
      <h1> manage staff</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: "100px",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All Staff" value="1" />
              <Tab label="Free Staff" value="2" />
              <Tab label="In project staff" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">{<TableStaff />}</TabPanel>
          <TabPanel value="2">{<TableStaff />}</TabPanel>
          <TabPanel value="3">{<TableStaff />}</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default ManageStaff;
