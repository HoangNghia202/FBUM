import React, { useState, useEffect, use } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
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
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td className="text-left">{item.StaffName}</td>
                <td className="text-left">{item.MainPosition}</td>
                <td>{item.Level}</td>
              </tr>
            ))}
            {data.length == 0 && (
              <tr>
                <td colSpan="4">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffOfProject;
