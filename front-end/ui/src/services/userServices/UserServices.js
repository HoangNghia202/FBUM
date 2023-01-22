// const baseURL = process.evn.REACT_APP_JSON_API;
import axios from "axios";
const baseUrl = process.env.REACT_APP_JSON_API;
export const handleLogin = async (userId, password) => {
  console.log("userId >>> ", userId, "password>>>", password);

  try {
    const res = await axios.post(`${baseUrl}/api/login`, {
      StaffID: userId,
      Password: password,
    });
    console.log("res >>> ", res.data);
    if (res.data) {
      return {
        data: res.data,
        errCode: 0,
        message: "Login success",
      };
    } else {
      return {
        data: null,
        errCode: 1,
        message: "Login failed! ID or password is incorrect",
      };
    }
  } catch (error) {
    throw error;
  }
};
