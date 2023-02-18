import { Button } from "@mui/material";
import React, { useState, useEffect, use } from "react";

import "./staffOfProject.scss";

const StaffOfProject = (props) => {
  console.log("props>>>>", props);

  const staffs = props.staffs;
  console.log("staffs>>>>", staffs);

  console.log("staffs = null >>>", staffs == null);

  const [data, setData] = useState([]);
  console.log("staffs>>>>", staffs);
  useEffect(() => {
    if (staffs != null) {
      setData(staffs);
    }
  }, [staffs]);
  console.log("data>>>>", data);

  const handleScrollInfinite = () => {
    console.log("scrolling");

    if (
      window.document.documentElement.scrollHeight -
        Math.round(window.document.documentElement.scrollTop) ===
      window.document.documentElement.clientHeight
    ) {
      console.log("do some thing");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollInfinite);
    return () => {
      window.removeEventListener("scroll", handleScrollInfinite);
    };
  }, []);

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
            {data.length === 0 && (
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
