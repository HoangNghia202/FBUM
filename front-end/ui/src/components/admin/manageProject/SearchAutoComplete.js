import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import {
  searchProjectInProgress,
  searchProjectEnded,
  searchProjectInComing,
} from "../../../services/adminServices/AdminServices";
import { toast } from "react-toastify";

const baseUrl = process.env.REACT_APP_JSON_API;
export default function SearchAutoComplete(props) {
  console.log("props", props);

  const { searchData, setProject, typeProject, searchType, setManager } = props;

  console.log("searchData", searchData);
  const handleChange = async (event, newValue) => {
    console.log("value", event.target.value);
    let searchResult = [];
    if (searchType === "project") {
      if (typeProject === "projectInprogress") {
        searchResult = await searchProjectInProgress(newValue);
      }
      if (typeProject === "projectEnded") {
        searchResult = await searchProjectEnded(newValue);
      }

      if (typeProject === "projectIncoming") {
        searchResult = await searchProjectInComing(newValue);
      }
      console.log("searchResult", searchResult);
      if (searchResult.errCode == 0) {
        toast.success(searchResult.message);
        setProject(searchResult.projects);
      }
    }

    // if (searchType === "PM") {
    //   console.log("searchResult", searchResult);
    //   setManager(searchResult);
    // }
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
              handleChange(event, newValue);
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
