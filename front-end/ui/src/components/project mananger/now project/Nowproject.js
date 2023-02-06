import { Typography } from "@mui/material";
import { positions } from "@mui/system";
import Divider from "@mui/material/Divider";
function NowProject(props) {
  return (
    <>
      <div className="col-9 mt-5 pt-5">
        <div
          className="d-flex justify-content-center align-items-center project-contain row "
          style={{ height: "400px", border: "1px solid" }}
        >
          <div
            className="project-info-contain col-4 container "
            style={{ height: "100%" }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#f7f1e3",
                borderRadius: "10px",
                padding: "0 10px 0 10px",
              }}
            >
              <h4 className="pt-2">Project Name</h4>
              <div className="Project Manager my-5">
                <Divider textAlign="left">Project Manager</Divider>
                <h5 className="mt-2">Nguyen Dac Hoang Nghia</h5>
              </div>
              <div className="team-size">
                <Divider textAlign="left"> Team Size</Divider>
                <table
                  className="text-start mt-2"
                  style={{ backgroundColor: "#f7f1e3" }}
                >
                  <tr>
                    <td>
                      <b> Software Developer:</b>
                    </td>
                    <td>
                      <b className="p-2">10</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>Software Tester:</b>{" "}
                    </td>
                    <td>
                      {" "}
                      <b className="p-2"> 5</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <b>Business Analysis</b>{" "}
                    </td>
                    <td>
                      {" "}
                      <b className="px-2">12</b>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div className="col-8 container" style={{ height: "100%" }}>
            <div
              style={{
                backgroundColor: "#686de0",
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NowProject;
