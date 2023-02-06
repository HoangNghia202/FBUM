import { Outlet } from "react-router-dom";
import NavLeft from "./NavLeftPM";
import NavHeader from ".././../contain/NavHeader";

function PMPage(props) {
  return (
    <>
      <div className="row mx-0">
        <NavHeader />
        <div className="col-3">
          <NavLeft />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default PMPage;
