import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchAutoComplete from "./SearchAutoComplete";
import { useDispatch, useSelector } from "react-redux";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  console.log("props", props);
  const { projects } = props;
  const { projectId } = useParams();
  console.log("projectId", projectId);
  const inprogressPrj = projects.projectInprogress;
  // let inprogressPrj = [];
  // projects.map((item) => {
  //   if (Date.parse(item.workEnd) > Date.now()) {
  //     inprogressPrj.push(item);
  //   }
  // });

  let fromProject = inprogressPrj.filter((item) => item.id == projectId)[0];
  console.log("fromProject", fromProject);

  let restProject = inprogressPrj.filter((item) => item.id != projectId);

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(fromProject.staffs);
  const [right, setRight] = React.useState([]);

  const [projectLeft, setProjectLeft] = React.useState([...left]);
  const [projectRight, setProjectRight] = React.useState([...right]);

  console.log("projectLeft", projectLeft);
  console.log("projectRight", projectRight);
  console.log("left", left);
  console.log("right", right);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleReset = () => {
    console.log("handleReset");

    setLeft([...projectLeft]);
    setRight([...projectRight]);
  };

  const handleSave = () => {
    setProjectLeft([...left]);
    setProjectRight([...right]);
  };

  const customList = (items) => (
    <Paper sx={{ width: 300, height: 400, overflow: "auto" }}>
      <List dense component="div" role="list">
        <h3></h3>
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.name} (${value.position} ${value.level})`}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      md={9}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <h6>From {fromProject.projectName}</h6>
        {customList(left)}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0 || right.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            color="warning"
            aria-label="Reset List"
            onClick={() => handleReset()}
          >
            reset
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            aria-label="Save List"
            color="success"
            // onClick={handleSave}
          >
            save
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <div className="d-flex align-items-center">
          <h6 className="px-1">To</h6>{" "}
          <SearchAutoComplete
            searchData={restProject}
            setProject={(prj) => {
              setRight(prj.staffs);
              setProjectRight(prj.staffs);
            }}
          />
        </div>

        {customList(right)}
      </Grid>
    </Grid>
  );
}
