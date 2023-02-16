import { Avatar } from "@mui/material";
import { height } from "@mui/system";
import { useSelector } from "react-redux";

function Profile(props) {
  const currentUser = useSelector((state) => state.auth.authReducer.userInfo);
  return (
    <div
      className=" d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        style={{
          height: "400px",
          width: "300px",
          background: "rgb(169,34,195)",
          background:
            "linear-gradient(0deg, rgba(169,34,195,1) 0%, rgba(45,245,253,1) 100%)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            height: "90%",
            background: "rgb(255,255,255, 0.3)",
            margin: "1em 1em 1em 1em",
            marginBottom: "1em",
            borderRadius: "10px",
          }}
          className="row"
        >
          <div
            style={{
              background: `url("https://upload.wikimedia.org/wikipedia/commons/8/8b/FPT_Software_H%404x.png")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              height: "40%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                left: "38%",
              }}
            >
              <Avatar
                style={{
                  width: "70px",
                  height: "70px",
                }}
              ></Avatar>
            </div>
          </div>

          <div style={{ height: "60%", paddingTop: "60px" }}>
            <h4>{currentUser.StaffName}</h4>
            <h5>ID: {currentUser.StaffID}</h5>
            <h6>{currentUser.MainPosition}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
