import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";

export default function PaginationOutlined(props) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(props.totalPage);
  const handleChange = (event, value) => {
    setPage(value);
    props.onChangePage(value);
  };
  console.log("page", page);

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPage}
        page={page}
        variant="outlined"
        color="secondary"
        onChange={(event, values) => {
          handleChange(event, values);
        }}
      />
    </Stack>
  );
}
