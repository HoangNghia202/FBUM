import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function HomePage(props) {
  const navigate = useNavigate();
  const { userLogin } = props;
  const checkLogin = () => {
    if (userLogin.isUserLogin && userLogin.userInfo.role === "admin") {
      navigate("/admin/project");
    }
  };

  useEffect(() => {
    checkLogin();
  }, [userLogin]);
  return <>Hompage</>;
}

export default HomePage;
