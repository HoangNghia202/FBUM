import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
export default function SearchAutoComplete(props) {
  const { searchData } = props;
  console.log("searchData", searchData);
  const handleChange = (value) => {
    console.log("value", value);
    let searchResult = searchData.filter((item) =>
      item.ProjectName.toLowerCase().includes(value.toLowerCase())
    );
    console.log("searchResult", searchResult);
    props.setProject(searchResult);
  };
  return (
    <>
      <div className="search-contain d-flex justify-content-end my-3">
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            disableClearable
            options={searchData.map((option) => option.ProjectName)}
            onChange={(event, newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search project"
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// const top100Films = [
//   { projectName: "The Shawshank Redemption", company: "FPT university" },
//   { projectName: "The Godfather", company: 1972 },
//   { projectName: "The Godfather: Part II", company: 1974 },
//   { projectName: "The Dark Knight", company: 2008 },
//   { projectName: "12 Angry Men", company: 1957 },
//   { projectName: "Schindler's List", company: 1993 },
//   { projectName: "Pulp Fiction", company: 1994 },
//   {
//     projectName: "The Lord of the Rings: The Return of the King",
//     company: 2003,
//   },
// ];
