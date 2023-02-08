import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import {
  searchProjectEnded,
  searchProjectInComing,
  searchProjectInProgress,
} from "../../../services/adminServices/AdminServices";
import { useCookies } from "react-cookie";

function DynamicSearchProject(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;
  const { setProject, typeProject } = props;
  const [searchItem, setSearchItem] = useState("");
  const typingTimeoutRef = useRef(null);

  const findAndDisplayItem = async (content) => {
    let searchResult = [];
    if (typeProject) {
      if (typeProject === "projectInprogress") {
        searchResult = await searchProjectInProgress(content, token);
      }
      if (typeProject === "projectEnded") {
        searchResult = await searchProjectEnded(content, token);
      }

      if (typeProject === "projectIncoming") {
        searchResult = await searchProjectInComing(content, token);
      }
      console.log("searchResult", searchResult);
      if (searchResult.errCode == 0) {
        setProject(searchResult.projects);
      }
    }

    // if (searchType === "PM") {
    //   console.log("searchResult", searchResult);
    //   setManager(searchResult);
    // }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchItem(value);
    // if (!onSearchChange) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      console.log("search content after 500ms: ", value);

      findAndDisplayItem(value.trim());
    }, 500);
  };

  const handleClickClear = () => {
    setSearchItem("");
    props.resetScreen();
  };

  return (
    <>
      <div>
        <Box sx={{ display: "flex", justifyContent: "end", marginY: "20px" }}>
          <TextField
            id="outlined-search"
            label="Search project"
            type="search"
            variant="outlined"
            size="small"
            value={searchItem}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="warning"
            className="mx-2"
            onClick={() => handleClickClear()}
          >
            Clear
          </Button>
        </Box>
      </div>
    </>
  );
}

export default DynamicSearchProject;
