import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function HomePage(props) {
  const navigate = useNavigate();
  const { userLogin } = props;
  const checkLogin = () => {
    if (userLogin.isUserLogin && userLogin.userInfo.role === "admin") {
      navigate("/admin/project");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLogin();
  }, [userLogin]);
  return <div></div>;
}

export default HomePage;
