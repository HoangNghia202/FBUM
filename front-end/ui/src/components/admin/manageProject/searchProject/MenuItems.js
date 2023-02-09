import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Checkbox, Paper, TextField } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Fade from "@mui/material/Fade";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useEffect, useState, useRef } from "react";

function MenuFilterItem(props) {
  console.log("props", props);

  const {
    type,
    icon,
    name,
    searchResult,
    handleSetSearchModel,
    setResultChecked,
    resultChecked,
    handleSearchStaff,
    handleResetSearchResultStaff,
  } = props;

  const [anchor, setAnchor] = useState(null);
  const [allResult, setAllResult] = useState([]);

  const [searchContent, setSearchContent] = useState({
    PM: "",
    dev: "",
    BA: "",
    tester: "",
  });

  const [value, setValue] = useState("female");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [searchItem, setSearchItem] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChangeField = (e) => {
    const { name, value } = e.target;
    console.log(name, ": ", value);
    let type = name;
    setSearchContent({ ...searchContent, [type]: value });
    setSearchItem(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      console.log("search content after 500ms: ", value);
      handleSearchStaff(value.trim(), type);
    }, 500);
  };

  Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i].StaffID === a[j].StaffID) a.splice(j--, 1);
      }
    }

    return a;
  };

  useEffect(() => {
    setAllResult(resultChecked.concat(searchResult).unique());
  }, [resultChecked, searchResult]);
  console.log("resultChecked>>>", resultChecked);
  console.log("all result", allResult);

  const open = Boolean(anchor);
  console.log("open", open);

  const handleClick = (event) => {
    // console.log("event", event.currentTarget);

    setAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
    handleResetSearchResultStaff(type);
    setSearchContent({ ...searchContent, [type]: "" });
  };

  const checkChecked = (id) => {
    return resultChecked.some((item) => item.StaffID === id);
  };

  const handleCheck = (e, staff) => {
    console.log("check", e.target.checked);
    console.log("staff", staff);
    console.log("type", type);

    if (e.target.checked) {
      if (type !== "PM") {
        setResultChecked(type, [...resultChecked, staff]);
      } else {
        setResultChecked(type, [staff]);
      }
    } else {
      setResultChecked(
        type,
        resultChecked.filter((item) => item.StaffID !== staff.StaffID)
      );
    }
    handleClose();
  };

  console.log("check checked NV001>>>", checkChecked("NV001"));

  return (
    <>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <span>
          {icon} {name} <KeyboardArrowDownIcon />
        </span>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchor}
        open={open}
        TransitionComponent={Fade}
        sx={{ width: "500px" }}
        onClose={handleClose}
      >
        <Box sx={{ px: 1 }}>
          <TextField
            name={type}
            size="small"
            label={name + " name"}
            variant="standard"
            fullWidth
            value={searchContent[type]}
            sx={{ width: "300px" }}
            onChange={(event) => handleChangeField(event)}
          />

          <Box className="pm-search-result" sx={{ mt: 2 }}>
            {/* <Paper elevation={6} sx={{ backgroundColor: "", mt: 1, p: 1 }}>
              <input
                type="radio"
                id="PM"
                name="PM"
                value={""}
                onChange={(event) => handleCheck(event, item)}
                checked
              />
              <label for="PM" style={{ margin: "0 10px" }}>
                None
              </label>
              <br></br>
            </Paper>
            ; */}
            {type === "PM" &&
              allResult.map((item) => {
                return (
                  <Paper
                    elevation={6}
                    sx={{ backgroundColor: "", mt: 1, p: 1 }}
                  >
                    <input
                      type="radio"
                      id="PM"
                      name="PM"
                      value={item.StaffID}
                      onChange={(event) => handleCheck(event, item)}
                      defaultChecked={checkChecked(item.StaffID)}
                    />
                    <label
                      for="PM"
                      style={{
                        margin: "0 10px",
                      }}
                    >
                      {item.StaffName}
                      {checkChecked(item.StaffID) ? (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => props.setEmptyCheckedPM()}
                        >
                          <DeleteForeverIcon />{" "}
                        </Button>
                      ) : (
                        <span></span>
                      )}
                    </label>

                    <br></br>
                  </Paper>
                );
              })}
            {(type === "dev" || type === "BA" || type === "tester") &&
              allResult.map((item) => {
                return (
                  <Paper elevation={6} sx={{ backgroundColor: "", mt: 1 }}>
                    <Checkbox
                      defaultChecked={checkChecked(item.StaffID)}
                      value={item.StaffID}
                      onChange={(event) => handleCheck(event, item)}
                    ></Checkbox>{" "}
                    <span>{item.StaffName}</span>
                  </Paper>
                );
              })}
          </Box>
        </Box>
      </Menu>
    </>
  );
}

export default MenuFilterItem;
