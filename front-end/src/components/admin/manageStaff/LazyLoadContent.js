import { Paper } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

function LazyLoadContent(props) {
  const fetchMoreData = () => {
    console.log("fetch more data");
  };
  return (
    <div className="lazy-load-content">
      <InfiniteScroll
        hasMore
        next={fetchMoreData}
        dataLength={props.staffs.length}
      >
        {props.staffs.map((staff, index) => {
          return <Paper sx={{ p: 5 }}>{staff.StaffName}</Paper>;
        })}
      </InfiniteScroll>
    </div>
  );
}

export default LazyLoadContent;
