import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getStaffsAvailableForAdding } from "../../../services/adminServices/AdminServices";

function AddStaffsToProject() {
  const { projectId } = useParams();
  const [availableStaffs, setAvailableStaffs] = useState([]);
  useEffect(() => {
    const getStaffsAvailable = async () => {
      let res = await getStaffsAvailableForAdding(projectId);
      setAvailableStaffs(res);
    };

    getStaffsAvailable();
  }, []);
  console.log("availableStaffs", availableStaffs);
  return (
    <>
      <div className="col-9 row">
        <div
          className="col-8"
          style={{ height: "100vh", backgroundColor: "#FFD700" }}
        ></div>
        <div
          className="col-4"
          style={{ height: "100vh", backgroundColor: "#46B27E" }}
        ></div>
      </div>
    </>
  );
}

export default AddStaffsToProject;
