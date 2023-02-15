import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { findProjectByPMID } from "../../../services/PMServices/PMServices";
import { useNavigate } from "react-router-dom";
function DetailIncomingProject(props) {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const PMInfo = useSelector((state) => state.auth.authReducer.userInfo);
  const { projectID } = useParams();
  const [incomingProject, setIncomingProject] = useState({});
  console.log("Project ID>>>", projectID);
  //   useEffect(() => {
  //     if (PMInfo.StaffRole !== "Project Manager") {
  //       navigate("/");
  //     }
  //   });

  useEffect(() => {
    const findProject = async () => {
      let res = await findProjectByPMID(PMInfo.StaffID, token);
      console.log("ress>>", res);

      if (res.errCode === 0) {
        let project = res.data.incomingProject.filter(
          (item) => item.ProjectID == projectID
        )[0];

        setIncomingProject(project);
      }
    };
    findProject();
  }, []);
  console.log("incomingProject>>>", incomingProject);

  return (
    <div className="col-9 mt-5 pt-5" style={{ height: "100%" }}>
      <div
        className="d-flex justify-content-center project-contain row "
        style={{
          height: "400px",
        }}
      >
        <div
          className="project-info-contain col-4 container "
          style={{ height: "100%" }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: "#BAE9EE",
              borderRadius: "10px",
              padding: "0 10px 0 10px",
            }}
          >
            <h4 className="pt-2">{incomingProject.ProjectName}</h4>
            <h6>(ID: {incomingProject.ProjectID})</h6>
            <div className="Project Manager my-5">
              <Divider textAlign="left">Project Manager</Divider>
              <h5 className="mt-2">{incomingProject.Manager}</h5>
            </div>
            <div className="team-size">
              <Divider textAlign="left">
                {" "}
                Team Size - {incomingProject.Staffs?.length}
              </Divider>
              <table
                className="text-start mt-2"
                style={{ backgroundColor: "#BAE9EE" }}
              >
                <tr>
                  <td>
                    <b> Software Developer:</b>
                  </td>
                  <td>
                    <b className="p-2">
                      {
                        incomingProject.Staffs?.filter(
                          (item) => item.MainPosition == "Software Developer"
                        ).length
                      }
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    <b>Software Tester:</b>{" "}
                  </td>
                  <td>
                    {" "}
                    <b className="p-2">
                      {
                        incomingProject.Staffs?.filter(
                          (item) => item.MainPosition == "Software Tester"
                        ).length
                      }
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    <b>Business Analysis</b>{" "}
                  </td>
                  <td>
                    {" "}
                    <b className="px-2">
                      {
                        incomingProject.Staffs?.filter(
                          (item) => item.MainPosition == "Business Analysis"
                        ).length
                      }
                    </b>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div className="col-8 container" style={{ height: "100%" }}>
          <div
            style={{
              backgroundColor: "#f0f8ff",
              height: "400px",
              borderRadius: "10px",
              border: "1px solid #A7ABB7 ",
            }}
          >
            <div style={{ backgroundColor: "#f0f8ff", borderRadius: "10px" }}>
              <h4 style={{ backgroundColor: "#f0f8ff", borderRadius: "10px" }}>
                Team's Members
              </h4>
            </div>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Position</th>
                    <th scope="col">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingProject.Staffs &&
                    incomingProject.Staffs.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td className="text-start">{item.StaffName}</td>
                        <td className="text-start">
                          {item.MainPosition}{" "}
                          {item.StaffID === PMInfo.StaffID ? "(PM)" : ""}
                        </td>
                        <td>{item.Level}</td>
                      </tr>
                    ))}
                  {incomingProject.Staffs?.length === 0 && (
                    <tr>
                      <td colSpan="5">No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailIncomingProject;
