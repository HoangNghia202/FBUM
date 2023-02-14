import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import { getPageOfSearchStaffByName } from "../../../services/adminServices/AdminServices";

function SearchStaffResultTable(props) {
  const {
    staffsToDisPlay,
    itemType,
    deleteStaff,
    handleClickUpdate,
    // totalPage,
    selectType,
    handleLoadMoreData,
    keyWord,
    token,
  } = props;

  // const [type, setType] = useState(0);

  // useEffect(() => {
  //   console.log("selectType in useEffect", type);
  //   setType(selectType);
  // }, [selectType]);
  console.log("props in SearchStaffResultTable: ", props);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endPageMessage, setEndPageMessage] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  //   const [item_type, setItem_type] = useState(0);
  console.log("selectType", selectType);
  console.log("current page: ", page);

  useEffect(() => {
    const getTotalPage = async () => {
      let item_type = 0;

      if (itemType === "allStaff") {
        item_type = 1;
      }
      if (itemType === "freeStaff") {
        item_type = 2;
      }
      if (itemType === "inProjectStaff") {
        item_type = 3;
      }

      let res = await getPageOfSearchStaffByName(
        item_type,
        selectType,
        keyWord,
        token
      );
      console.log("res in useEffect getTotalPage", res);
      if (res && res.errCode === 0) {
        setTotalPage(res.data);
      } else {
        console.log(res.message);
      }
    };
    getTotalPage();
  }, [staffsToDisPlay]);

  console.log("total page: ", totalPage);

  useEffect(() => {
    setPage(1);
    setEndPageMessage("");
  }, [selectType]);

  useEffect(() => {
    const loadMoreData = async () => {
      setLoading(true);
      let item_type = 0;

      if (itemType === "allStaff") {
        item_type = 1;
      }
      if (itemType === "freeStaff") {
        item_type = 2;
      }
      if (itemType === "inProjectStaff") {
        item_type = 3;
      }
      setTimeout(async () => {
        let res = await handleLoadMoreData(
          item_type,
          selectType,
          keyWord,
          page
        );
        console.log("res in useEffect loadMoreData", res);
        if (res && res.errorCode === 0) {
          setLoading(false);
        } else {
          setLoading(false);
          setEndPageMessage(res.message);
        }
      }, 500);
    };
    if (page > 1 && page <= totalPage) {
      loadMoreData();
    } else {
      // if (page > totalPage ) {
      setEndPageMessage("You are at the end of the list");
      // }
    }
  }, [page]);

  const handleScrollInfinite = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.offsetHeight
      ) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollInfinite);
    return () => window.removeEventListener("scroll", handleScrollInfinite);
  }, []);
  return (
    <div className="">
      <table
        class="table table-striped table-hover"
        style={{ borderRadius: "10px" }}
      >
        <thead
          className="bg-primary text-white rounded-top"
          style={{ zIndex: "1", position: "sticky", top: "100px" }}
        >
          <tr>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">level</th>

            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffsToDisPlay.map((item, index) => {
            return (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{item.StaffID}</td>
                <td>{item.StaffName}</td>
                <td>{item.MainPosition}</td>
                <td>{item.Level}</td>
                {itemType === "freeStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        let confirm = window.confirm(
                          "Are you sure to delete this staff? "
                        );
                        if (confirm) {
                          deleteStaff(item.StaffID);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                )}

                {itemType === "inProjectStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        let confirm = window.confirm(
                          "Are you sure to delete this staff? This action will also delete this staff from project he/she is working on."
                        );
                        deleteStaff(item.StaffID);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                )}

                {itemType === "allStaff" && (
                  <td>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      style={{ marginRight: "5px" }}
                      onClick={() => {
                        handleClickUpdate(item);
                      }}
                    >
                      Update
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {loading === true && <div className="text-center">Loading..</div>}

      {/* {endPageMessage && !loading && (
        <div className="text-center">
          {" "}
          You have reached the end of the list{" "}
        </div>
      )} */}
      {/* {loading && !isEndPage ? (
        <div className="text-center">You have reached the end of the list</div>
      ) : (
        <div className="text-center">Loading...</div>
      )} */}
    </div>
  );
}

export default SearchStaffResultTable;
