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
import { useCookies } from "react-cookie";

const baseUrl = process.env.REACT_APP_JSON_API;
export default function SearchAutoComplete(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;

  const { searchData, setProject, typeProject, searchType, setManager } = props;

  const handleChange = async (event, newValue) => {
    let searchResult = [];
    if (searchType === "project") {
      if (typeProject === "projectInprogress") {
        searchResult = await searchProjectInProgress(newValue, token);
      }
      if (typeProject === "projectEnded") {
        searchResult = await searchProjectEnded(newValue, token);
      }

      if (typeProject === "projectIncoming") {
        searchResult = await searchProjectInComing(newValue, token);
      }
      if (searchResult.errCode == 0) {
        toast.success(searchResult.message);
        setProject(searchResult.projects);
      }
    }
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
