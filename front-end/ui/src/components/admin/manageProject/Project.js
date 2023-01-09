import React from "react";
import "./Project.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
function Project(props) {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="manage-project col-9 ">
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
              {" "}
              <div className="processing-proj row d-flex">
                <div className="col-2 col-md-3 row">
                  <div className="container">
                    <div className="card ">
                      <div className="card-body">
                        <h5 className="card-title">FBUM</h5>
                        <hr className="m-0"></hr>
                        <p className="card-text">Company: Fsoft</p>
                        <a href="#" className="card-link">
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-2 col-md-3 row">
                  <div className="container">
                    <div className="card ">
                      <div className="card-body">
                        <h5 className="card-title">FBUM</h5>
                        <hr className="m-0"></hr>
                        <p className="card-text">Company: Nghia company hehe</p>
                        <a href="#" className="card-link">
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-2 col-md-3 row">
                  <div className="container">
                    <div className="card ">
                      <div className="card-body">
                        <h5 className="card-title">FBUM</h5>
                        <hr className="m-0"></hr>
                        <p className="card-text">Company: Nghia company hehe</p>
                        <a href="#" className="card-link">
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              {" "}
              <div className="ended-proj row">
                <div className="processing-proj row d-flex">
                  <div className="col-2 col-md-3 row">
                    <div className="container">
                      <div className="card card-end">
                        <div className="card-body">
                          <h5 className="card-title">FBUM</h5>
                          <hr className="m-0"></hr>
                          <p className="card-text">Company: Fsoft</p>
                          <a href="#" className="card-link">
                            View details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
}

export default Project;
