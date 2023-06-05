import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { searchStaffByName } from "../../../services/adminServices/AdminServices";
import { useCookies } from "react-cookie";

function DynamicSearchStaff(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;
  const { itemType, selectType, setStatusSearchStaff, resetScreen } = props;
  const [searchItem, setSearchItem] = useState("");
  const typingTimeoutRef = useRef(null);

  console.log("props", props);

  useEffect(() => {
    setStatusSearchStaff("", []);
    setSearchItem("");
  }, [selectType, itemType]);

  const findAndDisplayItem = async (keyWord) => {
    let searchResult = [];
    let page = 1;
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
    let res = await searchStaffByName(
      item_type,
      selectType,
      keyWord,
      page,
      token
    );
    if (res.errCode == 0) {
      searchResult = res.data;
      setStatusSearchStaff(keyWord, searchResult);
    } else {
      toast.error("Staff with name " + keyWord + " not found!");
      console.log("error dynamic search >>>", res.message);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchItem(value);
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
    resetScreen();
  };

  return (
    <>
      <div>
        <Box sx={{ display: "flex", justifyContent: "end", marginY: "20px" }}>
          <TextField
            id="outlined-search"
            label="Search staff's name"
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

export default DynamicSearchStaff;
