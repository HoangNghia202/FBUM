import { findProjectByStaffID } from "../../services/staffService/StaffServices";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import moment from "moment/moment";

function YourProject(props) {
    const [project, setProject] = useState({});
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const currentUser = useSelector((state) => state.auth.authReducer.userInfo);
    console.log("current user>>>", currentUser);
    useEffect(() => {
        const findProject = async () => {
            let type = "";
            if (currentUser.MainPosition === "Software Developer") {
                type = "dev";
            } else {
                if (currentUser.MainPosition === "Software Tester") {
                    type = "tester";
                } else {
                    type = "BA";
                }
            }
            let id = currentUser.StaffID;
            let res = await findProjectByStaffID(id, type, token);
            console.log("res>>>", res);

            if (res.errCode === 0) {
                setProject(res.data.nowProject);
            }
        };
        findProject();
    }, []);
    console.log("project>>>", project);
    return (
        <>
            {project && Object.keys(project).length > 0 ? (
                <div className="row mx-0 100vh">
                    <div
                        className="d-flex justify-content-center align-items-center 100vh"
                        style={{ height: "100vh" }}
                    >
                        <div
                            style={{
                                width: "30rem",
                                height: "25rem",
                                borderRadius: "10px",
                                backgroundColor: "red",
                                background: " rgb(63,94,251)",
                                background:
                                    "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
                                position: "",
                                boxShadow:
                                    " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                            }}
                        >
                            <div>
                                <h3 className="py-1" style={{ color: "#fff" }}>
                                    {project.ProjectName}
                                </h3>
                            </div>
                            <div
                                style={{
                                    height: "85%",
                                    background: "white",
                                    position: "",
                                    bottom: "0",

                                    borderRadius: "40px 0 0 0",
                                    border: "0 1px 1px 1px solid black",
                                }}
                            >
                                <div className="pt-5 px-5">
                                    <table
                                        className="table table-striped"
                                        style={{
                                            width: "100%",
                                            background: "#ffffff",
                                        }}
                                    >
                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #bdbdbd",
                                            }}
                                        >
                                            <td className="text-start">
                                                <h5>Project ID</h5>
                                            </td>
                                            <td>
                                                <b className="text-muted">
                                                    {project.ProjectID}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #bdbdbd",
                                            }}
                                        >
                                            <td className="text-start">
                                                <h5>Project Manager</h5>
                                            </td>
                                            <td>
                                                <b className="text-muted">
                                                    {project.Manager}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #bdbdbd",
                                            }}
                                        >
                                            <td className="text-start">
                                                <h5>Team's size</h5>
                                            </td>
                                            <td>
                                                <b className="text-muted">
                                                    {project.Staffs?.length}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #bdbdbd",
                                            }}
                                        >
                                            <td className="text-start">
                                                <h5>Date Start</h5>
                                            </td>
                                            <td>
                                                <b className="text-muted">
                                                    {" "}
                                                    {moment(
                                                        project.TimeStart
                                                    ).format("MM-DD-YYYY")}{" "}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #bdbdbd",
                                            }}
                                        >
                                            <td className="text-start">
                                                <h5>Date End</h5>
                                            </td>
                                            <td>
                                                <b className="text-muted">
                                                    {moment(
                                                        project.TimeEnd
                                                    ).format("MM-DD-YYYY")}
                                                </b>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="d-flex justify-content-center align-items-center 100vh"
                    style={{ height: "100vh" }}
                >
                    <div className="alert alert-info">
                        You don't have any project now
                    </div>
                </div>
            )}
        </>
    );
}

export default YourProject;
