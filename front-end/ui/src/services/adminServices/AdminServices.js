import axios from "axios";

const baseUrl = process.env.REACT_APP_JSON_API;

export const handleCreateProject = async (project) => {
  console.log("project", project);
  try {
    let res = await axios.post(`${baseUrl}/api/createProject`, project);
    const message = {
      success: "Create new project successfully",
      failed: "Create new project failed",
      invalid: "Project's information is invalid",
    };
    console.log("res>>>", res.data);
    switch (res.data) {
      case message.success:
        alert(message.success);
        return {
          errCode: 0,
        };

      case message.failed:
        alert(message.failed);
        return {
          errCode: 1,
        };

      case message.invalid:
        alert(message.invalid);
        return {
          errCode: 2,
        };

      default:
        break;
    }
  } catch (error) {
    console.log("error>>>", error);
  }
};
