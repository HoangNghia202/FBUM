import NavLeftAdmin from "./NavLeftAdmin";
import { Outlet } from "react-router-dom";
import Project from "./manageProject/Project";
function AdminPage() {
  return (
    <div className="row">
      <NavLeftAdmin />
      <Outlet />
    </div>
  );
}

export default AdminPage;
