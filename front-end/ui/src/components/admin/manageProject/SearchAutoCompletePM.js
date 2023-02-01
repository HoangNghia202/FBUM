import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";

const baseUrl = process.env.REACT_APP_JSON_API;
export default function SearchAutoCompletePM(props) {
  console.log("props", props);
  const { searchData, setManager } = props;
  console.log("searchData", searchData);
  const handleChange = async (value) => {
    console.log("value", value);
    let searchResult = searchData.filter((item) =>
      item.StaffName.toLowerCase().includes(value.toLowerCase())
    )[0];

    console.log("searchResult", searchResult);
    setManager(searchResult);
  };
  return (
    <>
      <div className="search-contain d-flex justify-content-end my-3">
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            disableClearable
            sx={{ width: "100%" }}
            options={searchData.map((option) => option.StaffName)}
            onChange={(event, newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Project Manager"
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
