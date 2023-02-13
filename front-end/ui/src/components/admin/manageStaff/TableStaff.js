import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";

function TableStaff(props) {
  const {
    staffsToDisPlay,
    itemType,
    deleteStaff,
    handleClickUpdate,
    totalPage,
    selectType,
    handleLoadMoreData,
  } = props;
  // const [type, setType] = useState(0);

  // useEffect(() => {
  //   console.log("selectType in useEffect", type);
  //   setType(selectType);
  // }, [selectType]);
  console.log("props in TableStaff: ", props);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEndPage, setIsEndPage] = useState(false);
  console.log("selectType", selectType);
  console.log("current page: ", page);
  useEffect(() => {
    setPage(1);
  }, [selectType]);

  useEffect(() => {
    const loadMoreData = async () => {
      setLoading(true);
      setTimeout(async () => {
        let res = await handleLoadMoreData(page, selectType);
        console.log("res in useEffect loadMoreData", res);
        if (res && res.errorCode === 0) {
          setLoading(false);
        } else {
          setLoading(false);
          setIsEndPage(true);
        }
      }, 500);
    };
    if (page > 1 && page <= totalPage) {
      loadMoreData();
    } else {
      if (page > totalPage) {
        setIsEndPage(true);
      }
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
      {/* {loading && <div className="text-center">Loading..</div>}

      {!loading && isEndPage && (
        <div className="text-center">
          {" "}
          You have reached the end of the list{" "}
        </div>
      )} */}
      {loading && !isEndPage ? (
        <div className="text-center">You have reached the end of the list</div>
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </div>
  );
}

export default TableStaff;
