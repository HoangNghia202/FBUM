import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { findProjectByPMId } from "../../../services/PMServices/PMServices";
import { useNavigate } from "react-router-dom";
import { handleRemoveStaffOutOfProject } from "../../../services/adminServices/AdminServices";
import { Button, Tooltip, Typography } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import moment from "moment";
import { toast } from "react-toastify";
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
    const findProject = async () => {
        let res = await findProjectByPMId(PMInfo.StaffID, token);
        console.log("ress>>", res);

        if (res.errCode === 0) {
            let project = res.data.incomingProject.filter(
                (item) => item.ProjectID == projectID
            )[0];

            setIncomingProject(project);
        }
    };

    useEffect(() => {
        findProject();
    }, []);

    const handleClickDeleteProject = async (staff) => {
        console.log("delete staff", staff);

        let confirmDelete = window.confirm(
            `Are you sure to delete this staff ${staff.StaffName}`
        );
        if (confirmDelete) {
            let res = await handleRemoveStaffOutOfProject(
                staff.StaffID,
                incomingProject.ProjectID,
                token
            );
            if (res.errCode === 0) {
                toast.success(res.message);
                findProject();
            } else {
                toast.error(res.message);
            }
        }
    };
    console.log("incomingProject>>>", incomingProject);

    const handleClickAddMember = () => {
        navigate(`/PM/addStaff/${incomingProject.ProjectID}`);
    };

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

                            background: "rgb(169,34,195)",
                            background:
                                "linear-gradient(0deg, rgba(169,34,195,1) 0%, rgba(45,245,253,1) 100%)",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "rgb(255,255,255,0.3)",
                                padding: "0 10px 0 10px",
                                height: "100%",
                            }}
                        >
                            {" "}
                            <h4 className="pt-2">
                                {incomingProject.ProjectName}
                            </h4>
                            <h6>(ID: {incomingProject.ProjectID})</h6>
                            <div className="Project Manager py-2">
                                <Divider textAlign="left">
                                    Project Manager
                                </Divider>
                                <h5 className="mt-2">
                                    {incomingProject.Manager}
                                </h5>
                            </div>
                            <div className="team-size">
                                <Divider textAlign="left">
                                    {" "}
                                    Team Size - {incomingProject.Staffs?.length}
                                </Divider>
                                <b>
                                    Software Developer{" "}
                                    {
                                        incomingProject.Staffs?.filter(
                                            (item) =>
                                                item.MainPosition ==
                                                "Software Developer"
                                        ).length
                                    }
                                </b>
                                <br />

                                <b>
                                    Software Tester{" "}
                                    {
                                        incomingProject.Staffs?.filter(
                                            (item) =>
                                                item.MainPosition ==
                                                "Software Tester"
                                        ).length
                                    }
                                </b>
                                <br />
                                <b>
                                    Business Analysis{" "}
                                    {
                                        incomingProject.Staffs?.filter(
                                            (item) =>
                                                item.MainPosition ==
                                                "Business Analysis"
                                        ).length
                                    }
                                </b>
                                <div className="mt-2">
                                    <Divider textAlign="left">
                                        Project Duration
                                    </Divider>
                                    <b>
                                        Date Start:{" "}
                                        {moment(
                                            incomingProject.TimeStart
                                        ).format("MM-DD-YYYY")}
                                    </b>
                                    <br />
                                    <b>
                                        Date End:{" "}
                                        {moment(incomingProject.TimeEnd).format(
                                            "MM-DD-YYYY"
                                        )}
                                    </b>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Button
                                    variant="contained"
                                    onClick={handleClickAddMember}
                                >
                                    Add member
                                </Button>
                            </div>
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
                        <div
                            style={{
                                backgroundColor: "#f0f8ff",
                                borderRadius: "10px",
                            }}
                        >
                            <h4
                                style={{
                                    backgroundColor: "#f0f8ff",
                                    borderRadius: "10px",
                                }}
                            >
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomingProject.Staffs &&
                                        incomingProject.Staffs.map(
                                            (item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index + 1}
                                                    </th>
                                                    <td className="text-start">
                                                        {item.StaffName}
                                                    </td>
                                                    <td className="text-start">
                                                        {item.MainPosition}{" "}
                                                        {item.StaffID ===
                                                        PMInfo.StaffID
                                                            ? "(PM)"
                                                            : ""}
                                                    </td>
                                                    <td>{item.Level}</td>
                                                    <td
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            placement="left"
                                                            title={"Delete"}
                                                        >
                                                            <Button
                                                                disabled={
                                                                    item.StaffID ===
                                                                    PMInfo.StaffID
                                                                }
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() =>
                                                                    handleClickDeleteProject(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <DeleteSweepIcon
                                                                    color={
                                                                        item.StaffID ===
                                                                        PMInfo.StaffID
                                                                            ? "disabled"
                                                                            : "error"
                                                                    }
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            )
                                        )}
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
