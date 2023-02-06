import "../admin/NavLeftAdmin.scss";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GroupIcon from "@mui/icons-material/Group";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
function NavLeft(props) {
  return (
    <div className="col-3 nav-left pt-5 mt-5">
      <Nav className="nav-contain">
        <NavItem className="nav-item">
          <NavLink className="nav-link" to="nowProject">
            <LibraryBooksIcon />
            Your Now Project
          </NavLink>
        </NavItem>
      </Nav>

      <Nav className="nav-contain">
        <NavItem className="nav-item">
          <NavLink className="nav-link" to="inComingProject">
            <Diversity3Icon />
            Your Incoming Project
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}

export default NavLeft;
