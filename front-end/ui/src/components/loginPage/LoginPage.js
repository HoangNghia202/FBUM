import "./loginPage.scss";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../services/userServices/UserServices";
import { setUserSlider } from "../../redux/UserSlider";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function LoginPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    userId: "",
    password: "",
  });
  const [errLogin, setErrLogin] = useState("");
  const loginUser = async (event) => {
    event.preventDefault();
    console.log("run into login user");
    try {
      const res = await handleLogin(user.userId, user.password);
      console.log("res in login page >>> ", res);
      if (res.errCode === 0) {
        setErrLogin("");
        dispatch(setUserSlider(res.data));
        navigate("/");
        toast.success("Login successfully!");
      } else {
        setErrLogin(res.message);
      }
    } catch (error) {}
  };

  const handleChange = (event) => {
    console.log("handle change");
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <div className="wrapper">
      <div className="login-container row">
        <div className="login-form offset-5 col-7">
          <div className="login-form__title mt-5">
            <h3>Login To FBUM System</h3>
            <div>
              {errLogin && <div className="alert alert-danger">{errLogin}</div>}
            </div>
            <form className="p-5" onSubmit={loginUser}>
              <TextField
                error={false}
                label="User ID"
                variant="standard"
                name="userId"
                value={user.userId}
                helperText="Incorrect entry."
                onChange={(event) => handleChange(event)}
                fullWidth
              />

              <TextField
                label="Password"
                variant="standard"
                name="password"
                value={user.password}
                onChange={(event) => handleChange(event)}
                fullWidth
                type={"password"}
                className="mt-4"
              />
              <div className="mt-5">
                <button className="btn btn-primary mt-3" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
