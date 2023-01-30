import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getStaffsAvailableForAdding } from "../../../services/adminServices/AdminServices";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CustomScrollbars from "../../../contain/CustomScrollBar";
import { handleAddStaffToProject } from "../../../services/adminServices/AdminServices";
import { fetchProjects } from "../../../redux/ProjectSlider";

function AddStaffsToProject() {
  const { projectId } = useParams();
  const [availableStaffs, setAvailableStaffs] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [businessAnalysts, setBusinessAnalysts] = useState([]);
  const [testers, setTesters] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [value, setValue] = useState("1");

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const compareStaffs = (staff1, staff2) => {
    return staff1.Level - staff2.Level;
  };

  const getStaffsAvailable = async () => {
    let res = await getStaffsAvailableForAdding(projectId);
    setAvailableStaffs(res);
  };

  useEffect(() => {
    console.log("runinto get available staff");
    getStaffsAvailable();
  }, []);

  const separateStaffs = (staffs) => {
    let projectManagers = [];
    let developers = [];
    let businessAnalysts = [];
    let testers = [];
    staffs.forEach((staff) => {
      if (staff.StaffRole === "Project Manager") projectManagers.push(staff);
      else {
        if (staff.MainPosition === "Software Developer") developers.push(staff);
        else {
          if (staff.MainPosition === "Business Analysis")
            businessAnalysts.push(staff);
          else {
            if (staff.MainPosition === "Software Tester") testers.push(staff);
          }
        }
      }
    });

    setProjectManagers(projectManagers.sort(compareStaffs));
    setDevelopers(developers.sort(compareStaffs));
    setBusinessAnalysts(businessAnalysts.sort(compareStaffs));
    setTesters(testers.sort(compareStaffs));
  };

  useEffect(() => {
    separateStaffs(availableStaffs);
  }, [availableStaffs]);

  console.log("availableStaffs", availableStaffs);
  console.log("projectManagers", projectManagers);
  console.log("developers", developers);
  console.log("businessAnalysts", businessAnalysts);
  console.log("testers", testers);

  const handleChoseStaff = (staff) => {
    setSelectedStaffs([...selectedStaffs, staff]);
    setAvailableStaffs(
      availableStaffs.filter((item) => item.StaffID !== staff.StaffID)
    );
  };

  const handleRemoveStaff = (staff) => {
    setSelectedStaffs(
      selectedStaffs.filter((item) => item.StaffID !== staff.StaffID)
    );
    setAvailableStaffs([...availableStaffs, staff]);
  };

  const handleAddStaff = async () => {
    await handleAddStaffToProject(selectedStaffs, projectId);
    alert("Add staffs successfully");
    setSelectedStaffs([]);
    getStaffsAvailable();
    dispatch(fetchProjects(1));
  };
  return (
    <>
      <div className="col-9 row">
        <div className="col-8" style={{ height: "100vh", backgroundColor: "" }}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Project Manager" value="1" />
                  <Tab label="Developer" value="2" />
                  <Tab label="Business analysis" value="3" />
                  <Tab label="Tester" value="4" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div
                  style={{
                    height: "400px",
                    backgroundColor: "aliceblue",
                    overflowY: "scroll",
                    borderRadius: "10px 0 0 10px",
                    border: "1px solid #ccc",
                  }}
                >
                  {/* project manager */}
                  <table className="table  table-striped mb-0">
                    <thead>
                      <tr style={{ textAlign: "left" }}>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Position</th>
                        <th scope="col">Level</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "left" }}>
                      {projectManagers.map((staff, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{staff.StaffName}</td>
                          <td>{staff.MainPosition}</td>
                          <td>{staff.Level}</td>
                          <td>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => handleChoseStaff(staff)}
                            >
                              <PersonAddAlt1Icon />
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
              <TabPanel value="2">
                {/* developer */}
                <div
                  style={{
                    height: "400px",
                    backgroundColor: "aliceblue",
                    overflowY: "scroll",
                    borderRadius: "10px 0 0 10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <table className="table  table-striped mb-0">
                    <thead>
                      <tr style={{ textAlign: "left" }}>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Position</th>
                        <th scope="col">Level</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "left" }}>
                      {developers.map((staff, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{staff.StaffName}</td>
                          <td>{staff.MainPosition}</td>
                          <td>{staff.Level}</td>
                          <td>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => handleChoseStaff(staff)}
                            >
                              <PersonAddAlt1Icon />
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
              <TabPanel value="3">
                {/* business analysis */}
                <div
                  style={{
                    height: "400px",
                    backgroundColor: "aliceblue",
                    overflowY: "scroll",
                    borderRadius: "10px 0 0 10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <table className="table  table-striped mb-0">
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Position</th>
                        <th scope="col">Level</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "left" }}>
                      {businessAnalysts.map((staff, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{staff.StaffName}</td>
                          <td>{staff.MainPosition}</td>
                          <td>{staff.Level}</td>
                          <td>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => handleChoseStaff(staff)}
                            >
                              <PersonAddAlt1Icon />
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
              <TabPanel value="4">
                {/* tester */}
                <div
                  style={{
                    height: "400px",
                    backgroundColor: "aliceblue",
                    overflowY: "scroll",
                    borderRadius: "10px 0 0 10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <table className="table  table-striped mb-0">
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Position</th>
                        <th scope="col">Level</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "left" }}>
                      {testers.map((staff, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{staff.StaffName}</td>
                          <td>{staff.MainPosition}</td>
                          <td>{staff.Level}</td>
                          <td>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => handleChoseStaff(staff)}
                            >
                              <PersonAddAlt1Icon />
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
        <div
          className="col-4"
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "300px",
              height: "500px",
              position: "fixed",
              top: "100px",
            }}
          >
            <Box
              sx={{
                height: "400px",
                overflowY: "scroll",
                backgroundColor: "##FFFFFF",
                zIndex: "100",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            >
              <h5>List Will Add</h5>
              {selectedStaffs.length > 0 &&
                selectedStaffs.map((staff) => (
                  <Box
                    sx={{
                      backgroundColor: "#FFFFFF",
                      padding: 1,
                      margin: 2,
                      borderRadius: "10px",
                      boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px;",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>{staff.StaffName}</Box>

                    <Box> {staff.MainPosition}</Box>
                    <Box style={{}}>
                      <IconButton
                        color="error"
                        aria-label="upload picture"
                        component="label"
                        onClick={() => handleRemoveStaff(staff)}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
            </Box>

            <div className="my-2">
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleAddStaff()}
              >
                Save
              </Button>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default AddStaffsToProject;
