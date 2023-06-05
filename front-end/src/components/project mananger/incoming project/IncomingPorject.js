import moment from "moment";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { findProjectByPMId } from "../../../services/PMServices/PMServices";

function IncomingProject(props) {
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const [incomingProject, setIncomingProject] = useState([]);
    const PMInfo = useSelector((state) => state.auth.authReducer.userInfo);
    //   useEffect(() => {
    //     if (PMInfo.StaffRole !== "Project Manager") {
    //       navigate("/");
    //     }
    //   });
    useEffect(() => {
        const findProject = async () => {
            let res = await findProjectByPMId(PMInfo.StaffID, token);
            console.log("ress>>", res);

            if (res.errCode === 0) {
                setIncomingProject(res.data.incomingProject);
            }
        };
        findProject();
    }, []);
    console.log("incomingProject>>>", incomingProject);

    return (
        <>
            {incomingProject && incomingProject.length > 0 ? (
                <div className="col-9 pt-5">
                    <div className="incoming-proj row d-flex flex-row align-items-stretch mt-5">
                        {incomingProject?.map((item) => {
                            let percent = Math.floor(
                                ((Date.now() - Date.parse(item.TimeStart)) /
                                    (Date.parse(item.TimeEnd) -
                                        Date.parse(item.TimeStart))) *
                                    100
                            );

                            console.log("percent", percent);

                            return (
                                <div
                                    className="col-2 col-md-4 row"
                                    onClick={() => {
                                        navigate(
                                            `/PM/incomingProject/${item.ProjectID}`
                                        );
                                    }}
                                >
                                    <div className="container">
                                        <div className="card ">
                                            <div className="card-body">
                                                <h5
                                                    className="card-incoming"
                                                    style={{ height: "50px" }}
                                                >
                                                    {item.ProjectName}
                                                </h5>

                                                <div className="row px-2 cart-content">
                                                    <div className="text-black row">
                                                        <div className="col-6 text-start">
                                                            {" "}
                                                            <b>
                                                                Project ID
                                                            </b>{" "}
                                                        </div>
                                                        <div className="col-6 text-end">
                                                            {item.ProjectID}
                                                        </div>
                                                        <div className="col-6 text-start">
                                                            {" "}
                                                            <b>PM</b>{" "}
                                                        </div>
                                                        <div
                                                            className="col-6 text-end card-text text-truncate"
                                                            style={{
                                                                maxWidth:
                                                                    "500px",
                                                            }}
                                                        >
                                                            {item.Manager}
                                                        </div>
                                                        <div className="col-6 text-start">
                                                            {" "}
                                                            <b>
                                                                Team size
                                                            </b>{" "}
                                                        </div>
                                                        <div className="col-6 text-end">
                                                            {item.Staffs.length}
                                                        </div>
                                                        <div className="col-6 text-start">
                                                            {" "}
                                                            <b>
                                                                Day Start
                                                            </b>{" "}
                                                        </div>
                                                        <div className="col-6 text-end">
                                                            {moment(
                                                                item.TimeStart
                                                            ).format(
                                                                "MM-DD-YYYY"
                                                            )}
                                                        </div>
                                                        <div className="col-6 text-start">
                                                            {" "}
                                                            <b>Day End</b>{" "}
                                                        </div>
                                                        <div className="col-6 text-end">
                                                            {moment(
                                                                item.TimeEnd
                                                            ).format(
                                                                "MM-DD-YYYY"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* <div className="d-flex justify-content-center my-5 col-md-11 ">
                    <PaginationOutlined
                      totalPage={props.projects.totalPageProjectIncoming}
                      onChangePage={(pageNum) =>
                        dispatch(fetchProjectsIncoming(pageNum, token))
                      }
                    />
                  </div> */}
                    </div>
                </div>
            ) : (
                <div className="col-9 mt-5 pt-5" style={{ height: "100%" }}>
                    <div className="alert alert-info">
                        You don't have any project incoming
                    </div>
                </div>
            )}
        </>
    );
}

export default IncomingProject;
