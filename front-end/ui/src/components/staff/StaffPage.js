import { Outlet } from "react-router-dom";
import NavHeader from ".././../contain/NavHeader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
function StaffPage(props) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.authReducer.userInfo);
  useEffect(() => {
    if (currentUser.StaffRole !== "Staff") {
      navigate("/");
    } else {
      navigate("/staff/yourProject");
    }
  }, []);
  return (
    <>
      <NavHeader />
      <Outlet />
    </>
  );
}

export default StaffPage;
