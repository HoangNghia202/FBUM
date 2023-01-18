import { useEffect, useState } from "react";
import SearchAutoComplete from "./SearchAutoComplete";
function TableStaff(props) {
  const searchData = [
    { id: 1, name: "Nguyen Van A", position: "Developer", level: "3" },
    { id: 2, name: "Nguyen Van B", position: "Developer", level: "3" },
  ];
  const [data, setData] = useState(searchData);
  const showResult = (result) => {
    setData(result);
  };
  return (
    <>
      <SearchAutoComplete
        searchData={searchData}
        showResult={(searchResult) => {
          showResult(searchResult);
        }}
      />
      <table
        class="table table-striped table-hover"
        style={{ borderRadius: "10px" }}
      >
        <thead className="">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.position}</td>
                <td>{item.level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default TableStaff;
