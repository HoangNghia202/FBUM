import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
export default function SearchAutoComplete(props) {
  const { searchData, showResult } = props;
  console.log("searchData", searchData);
  const handleChange = (value) => {
    console.log("value", value);
    let searchResult = searchData.filter((item) =>
      item.StaffName.toLowerCase().includes(value.toLowerCase())
    );
    console.log("searchResult", searchResult);
    showResult(searchResult);
  };
  return (
    <>
      <div className="search-contain d-flex justify-content-end my-3">
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            disableClearable
            options={searchData.map((option) => option.StaffName)}
            onChange={(event, newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Name"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                size="small"
              />
            )}
          />
        </Stack>
      </div>
    </>
  );
}
