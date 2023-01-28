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
export const handleDeleteProject = async (projectId) => {
  console.log("project if will delete>>", projectId);
  try {
    let res = await axios.delete(`${baseUrl}/api/deleteProject/${projectId}`);
    console.log("res>>>", res.data);
    const message = {
      success: "Delete project successfully",
      failed: "Delete project failed",
    };
    switch (res.data) {
      case message.success:
        alert(message.success);
        return {
          errCode: 0,
          message: message.success,
        };
      case message.failed:
        alert(message.failed);
        return {
          errCode: 1,
          message: message.failed,
        };
      default:
        break;
    }
  } catch (error) {
    console.log("error>>>", error);
  }
};

export const handleRemoveStaffOutOfProject = async (staffID, projectID) => {
  try {
    let res = await axios.delete(
      `${baseUrl}/api/deleteStaffInproject/${projectID}/${staffID}`
    );
    console.log("res", res.data);

    const message = {
      success: "Delete project successfully",
      failed: "Delete project failed",
    };
    switch (res.data) {
      case message.success:
        alert("Remove staff out of project successfully");
        return {
          errCode: 0,
          message: "Remove staff out of project successfully",
        };

      case message.failed:
        alert("Remove staff out of project failed");
        return {
          errCode: 1,
          message: "Remove staff out of project failed",
        };

      default:
        break;
    }
  } catch (error) {}
};

export const getStaffsAvailableForAdding = async (projectId) => {
  try {
    let res = await axios.get(
      `${baseUrl}/api/project/staff_available/${projectId}`
    );
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log("error get staff can transfer>>>", error);
  }
};

export const findProjectInprogressAndAvailableStaffs = async (searchInput) => {
  try {
    const project = await axios.get(
      `${baseUrl}/api/project/search/${searchInput}`
    );
    console.log("project>>>", project.data);
    if (project.data != null) {
      if (Date.parse(project.data.TimeEnd) > Date.now()) {
        let staffAvailable = await axios.get(
          `${baseUrl}api/project/staff_available/${project.data.id}`
        );
        console.log("res>>>", staffAvailable.data);
        if (staffAvailable.data != null || staffAvailable.data != undefined) {
          alert("Project found and available staffs");
          return {
            errCode: 0,
            project: project.data,
            availableStaff: staffAvailable.data,
            message: "Project found and available staffs",
          };
        } else {
          alert("Project found but no available staffs");
          return {
            errCode: 1,
            project: project.data,
            availableStaff: [],
            message: "Project found but no available staffs",
          };
        }
      } else {
        alert("Project found but it is not in progress");
        return {
          errCode: 2,
          project: project.data,
          availableStaff: [],
          message: "Project found but it is not in progress",
        };
      }
    } else {
      alert("Project not found");
      return {
        errCode: 3,
        message: "Project not found",
        project: {},
        availableStaff: [],
      };
    }
  } catch (error) {
    console.log("error find project inprogress and available staffs>>>", error);
  }
};

export const searchProject = async (searchInput) => {
  try {
    let res = await axios.get(`${baseUrl}/api/project/search/${searchInput}`);
    console.log("res>>>", res.data);
    if (res.data != null) {
      let result = {
        errCode: 0,
        projects: [],
        message: "",
      };
      res.data.forEach((element) => {
        if (
          Date.parse(element.TimeEnd) > Date.now() &&
          Date.parse(element.TimeStart) < Date.now()
        ) {
          result.projects.push(element);
        }
      });
      if (result.projects.length > 0) {
        result.message = "Project found";
        return result;
      } else {
        result.errCode = 1;
        result.message =
          "Don't have any project in progress named " + searchInput;
        return result;
      }
    } else {
      return {
        errCode: 1,
        projects: [],
        message: "Project not found",
      };
    }
  } catch (error) {
    console.log("error search project>>>", error);
  }
};

export const getStaffAvailableBetweenTwoProject = async (
  fromProject,
  toProject
) => {
  try {
    let res = await axios.get(
      `${baseUrl}/api/project/staff_available/${fromProject}/${toProject}`
    );
    console.log(`available from ${fromProject} to ${toProject}`, res.data);
    if (res.data != null) {
      return {
        errCode: 0,
        staffs: res.data,
        message: "Get staff available between two project successfully",
      };
    } else {
      return {
        errCode: 1,
        staffs: [],
        message: "not have any staff available between two project",
      };
    }
  } catch (error) {}
};

export const transferStaffBetweenProject = async (
  fromProject,
  toProject,
  staffIDs
) => {
  try {
    let res = await axios.post(
      `${baseUrl}/api/transfer/${fromProject}/${toProject}`,
      staffIDs
    );
    console.log("res>>>", res.data);
    if (res.data == "Move staff successfully") {
      return {
        errCode: 0,
        message: "Transfer staff successfully",
      };
    } else {
      return {
        errCode: 1,
        message: "Transfer project failed",
      };
    }
  } catch (error) {
    console.log("error transfer project>>>", error);
  }
};
