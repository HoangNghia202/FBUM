import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { handleLogin } from "../services/userServices/UserServices";
import { setUserSlider } from "../redux/UserSlider";
import { useDispatch, useSelector } from "react-redux";

function HomePage(props) {
  const currentUser = useSelector((state) => state.auth.authReducer.userInfo);
  const isUserLogin = useSelector(
    (state) => state.auth.authReducer.isUserLogin
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userLogin } = props;
  const [cookies, setCookie, removeCookie] = useCookies(["userId", "password"]);
  const checkLogin = () => {
    if (isUserLogin && currentUser.StaffRole === "Admin") {
      navigate("/admin/project");
    } else {
      navigate("/login");
    }
  };

  // const checkCookiesUser = async () => {
  //   if (cookies.userId && cookies.password) {
  //     try {
  //       let res = await handleLogin(cookies.userId, cookies.password);
  //       if (res.errCode === 0) {
  //         dispatch(setUserSlider(res.data));
  //         if (res.data.StaffRole === "Admin") {
  //           navigate("/admin/project");
  //         }
  //       }
  //     } catch (error) {
  //       console.log("error: ", error);
  //     }
  //   } else {
  //     navigate("/login");
  //   }
  // };

  useEffect(() => {
    checkLogin();
  }, []);
  return <div></div>;
}

export default HomePage;
