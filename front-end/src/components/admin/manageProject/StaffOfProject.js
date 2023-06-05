import { Button } from "@mui/material";
import React, { useState, useEffect, use } from "react";

import "./staffOfProject.scss";

const StaffOfProject = (props) => {
  const staffs = props.staffs;

  const [data, setData] = useState([]);
  useEffect(() => {
    if (staffs != null) {
      setData(staffs);
    }
  }, [staffs]);

  return (
    <>
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <table className="table table-bordered table-striped mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Position</th>
              <th scope="col">Level</th>
              {(props.type === "inprogress" || props.type === "incoming") && (
                <th scope="col">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {props.loading && (
              <tr>
                <td colSpan={5} className="text-center">
                  Loading data ...
                </td>
              </tr>
            )}
            {data.map((item, index) => (
              <tr key={index}>
                <th className="text-start" scope="row">
                  {index + 1}
                </th>
                <td className="text-start">{item.StaffName}</td>
                <td className="text-start">
                  {item.MainPosition}{" "}
                  {item.StaffRole === "Project Manager" && "(PM)"}
                </td>
                <td>{item.Level}</td>

                {(props.type === "inprogress" || props.type === "incoming") && (
                  <td>
                    {" "}
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={item.StaffRole === "Project Manager"}
                      onClick={() =>
                        props.removeStaffOutOfProject(item.StaffID)
                      }
                    >
                      Remove
                    </Button>{" "}
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && props.loading == false && (
              <tr>
                <td colSpan="5">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffOfProject;
