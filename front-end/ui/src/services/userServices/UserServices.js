// const baseURL = process.evn.REACT_APP_JSON_API;
import axios from "axios";
const baseUrl = process.env.REACT_APP_JSON_API;
export const handleLogin = async (userId, password) => {
  console.log("userId >>> ", userId, "password>>>", password);

  try {
    const res = await axios.get(`${baseUrl}/users`);
    console.log("res >>> ", res.data);
    const user = res.data.find((user) => user.userId == userId);
    console.log("user >>> ", user);

    if (user) {
      if (user.userId == userId) {
        if (user.password == password) {
          return {
            errCode: 0,
            errMsg: "Login success",
            data: user,
          };
        } else {
          return {
            errCode: 1,
            errMsg: "Password is incorrect",
            data: null,
          };
        }
      }
    }
    return {
      errCode: 1,
      errMsg: "User ID is not exist",
      data: null,
    };
  } catch (error) {
    throw error;
  }
};
