import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = process.env.REACT_APP_JSON_API;

export const handleCreateProject = async (project, token) => {
  console.log("project", project);
  try {
    let res = await axios.post(`${baseUrl}/api/createProject`, project, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const message = {
      success: "Create new project successfully",
      failed: "Create new project failed",
      invalid: "Project's information is invalid",
    };
    console.log("res>>>", res.data);
    switch (res.data) {
      case message.success:
        toast.success(message.success);
        return {
          errCode: 0,
        };

      case message.failed:
        toast.error(message.failed);
        return {
          errCode: 1,
        };

      case message.invalid:
        toast.error(message.invalid);
        return {
          errCode: 2,
        };

      default:
        break;
    }
  } catch (error) {
    toast.error("Create new project failed! Server error");
    console.log("error>>>", error);
  }
};
export const handleDeleteProject = async (projectId, token) => {
  console.log("project if will delete>>", projectId);
  try {
    let res = await axios.delete(`${baseUrl}/api/deleteProject/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    const message = {
      success: "Delete project successfully",
      failed: "Delete project failed",
    };
    switch (res.data) {
      case message.success:
        toast.success(message.success);
        return {
          errCode: 0,
          message: message.success,
        };
      case message.failed:
        toast.error(message.failed);
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

export const handleRemoveStaffOutOfProject = async (
  staffID,
  projectID,
  token
) => {
  try {
    let res = await axios.delete(
      `${baseUrl}/api/deleteStaffInProject/${projectID}/${staffID}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("res", res.data);

    const message = {
      success: "Delete staff in project successfully",
      failed: "Delete staff in project failed",
    };
    switch (res.data) {
      case message.success:
        return {
          errCode: 0,
          message: "Remove staff out of project successfully",
        };

      case message.failed:
        return {
          errCode: 1,
          message: "Remove staff out of project failed",
        };

      default:
        break;
    }
  } catch (error) {}
};

export const getStaffsAvailableForAdding = async (projectId, token) => {
  try {
    let res = await axios.get(
      `${baseUrl}/api/project/staff_available/${projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log("error get staff can transfer>>>", error);
  }
};

export const findProjectInprogressAndAvailableStaffs = async (
  searchInput,
  token
) => {
  try {
    const project = await axios.get(
      `${baseUrl}/api/project/search/${searchInput}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("project>>>", project.data);
    if (project.data != null) {
      if (Date.parse(project.data.TimeEnd) > Date.now()) {
        let staffAvailable = await axios.get(
          `${baseUrl}api/project/staff_available/${project.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

export const searchProjectInProgress = async (searchInput, token) => {
  try {
    let res = await axios.get(`${baseUrl}/api/project/search/${searchInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

export const searchProjectEnded = async (searchInput, token) => {
  try {
    let res = await axios.get(`${baseUrl}/api/project/search/${searchInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data != null) {
      let result = {
        errCode: 0,
        projects: [],
        message: "",
      };
      res.data.forEach((element) => {
        if (Date.parse(element.TimeEnd) < Date.now()) {
          result.projects.push(element);
        }
      });
      if (result.projects.length > 0) {
        result.message = "Project found";
        return result;
      } else {
        result.errCode = 1;
        result.message = "Don't have any project ended named " + searchInput;
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

export const searchProjectInComing = async (searchInput, token) => {
  try {
    let res = await axios.get(`${baseUrl}/api/project/search/${searchInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data != null) {
      let result = {
        errCode: 0,
        projects: [],
        message: "",
      };
      res.data.forEach((element) => {
        if (Date.parse(element.TimeStart) > Date.now()) {
          result.projects.push(element);
        }
      });
      if (result.projects.length > 0) {
        result.message = "Project found";
        return result;
      } else {
        result.errCode = 1;
        result.message = "Don't have any project incoming named " + searchInput;
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
  toProject,
  token
) => {
  try {
    let res = await axios.get(
      `${baseUrl}/api/project/staff_available/${fromProject}/${toProject}`,
      { headers: { Authorization: `Bearer ${token}` } }
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
  staffIDs,
  token
) => {
  try {
    let res = await axios.post(
      `${baseUrl}/api/transfer/${fromProject}/${toProject}`,
      { value: staffIDs },
      { headers: { Authorization: `Bearer ${token}` } }
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

export const handleAddStaffToProject = async (staffs, projectId, token) => {
  try {
    if (staffs.length > 0) {
      await staffs.forEach((element) => {
        axios.put(
          `${baseUrl}/api/insertToProject/${projectId}/${element.StaffID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      });
      return {
        errCode: 0,
        message: "Add staffs to project successfully",
      };
    } else {
      return {
        errCode: 1,
        message: "Add staffs to project failed, empty list to add",
      };
    }
  } catch (error) {}
};

export const handleGetFreeProjectManager = async (time, token) => {
  console.log("time in handleGetFreeProjectManager >>>", time);
  let payload = {
    value: time,
  };
  try {
    console.log("payload>>>", payload);
    let res = await axios.post(`${baseUrl}/api/staffManagerFree`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data != null) {
      return {
        errCode: 0,
        PMs: res.data,
        message: "Get free project manager successfully",
      };
    } else {
      return {
        errCode: 1,
        PMs: [],
        message: "Not have any free project manager",
      };
    }
  } catch (error) {
    console.log("Error get free project manager>>>", error);
  }
};

export const handleCreateNewStaff = async (staff, token) => {
  try {
    let res = await axios.post(`${baseUrl}/api/createNewStaff`, staff, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>> ", res.data);
    if (res.data == "Create new staff successfully") {
      return {
        errCode: 0,
        message: "Create staff successfully",
      };
    }
    if (res.data == "Create new staff failed") {
      return {
        errCode: 1,
        message: "Create staff failed",
      };
    }
    if (res.data == "Staff's information is invalid") {
      return {
        errCode: 2,
        message: "Staff's information is invalid",
      };
    }
  } catch (error) {
    console.log("error create staff>>>", error);
  }
};

export const handleDeleteStaff = async (staffID, token) => {
  try {
    let res = await axios.delete(`${baseUrl}/api/deleteStaff/${staffID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>> ", res.data);
    if (res.data == "Delete staff successfully") {
      return {
        errCode: 0,
        message: "Delete staff successfully",
      };
    }
    if (res.data == "Delete staff failed") {
      return {
        errCode: 1,
        message: "Delete staff failed",
      };
    }
  } catch (error) {
    console.log("error delete staff>>>", error);
  }
};

export const handleUpdateStaff = async (staff, token) => {
  try {
    let res = await axios.put(`${baseUrl}/api/updateStaff`, staff, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res>>>", res.data);
    if (res.data == "Update staff successfully") {
      return {
        errCode: 0,
        message: "Update staff successfully",
      };
    }
    if (res.data == "Update staff failed") {
      return {
        errCode: 1,
        message: "Update staff failed",
      };
    }
  } catch (error) {
    console.log("error update staff>>>", error);
  }
};

export const advanceSearchProject = async (searchInput, token) => {
  try {
    let payload = {
      ProjectName: searchInput.projectName,
      ProjectManager: searchInput.PM,
      BusinessAnalysis: searchInput.BA,
      SoftwareDeveloper: searchInput.dev,
      SoftwareTester: searchInput.tester,
      TimeStart: searchInput.startDate,
      TimeEnd: searchInput.endDate,
    };
    console.log("payload>>>", payload);
    let res = await axios.post(
      `${baseUrl}/api/project/multiOptionSearch`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("res search project>>>", res.data);
    if (res.data.length > 0) {
      return {
        errCode: 0,
        data: res.data,
        message: "Project found",
      };
    } else
      return {
        errCode: 1,
        data: [],
        message: "Project not found",
      };
  } catch (error) {
    console.error(error);
  }
};

export const searchStaff = async (searchInput, type, token) => {
  try {
    let result = [];
    let res = await axios.get(`${baseUrl}/api/staff/search/${searchInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    switch (type) {
      case "PM":
        result = res.data.filter(
          (staff) => staff.StaffRole === "Project Manager"
        );
        if (result.length > 0) {
          return {
            errCode: 0,
            data: result,
            message: "PM found",
          };
        }
        return {
          errCode: 1,
          staffs: [],
          message: "PM not found",
        };

      case "dev":
        result = res.data.filter(
          (staff) =>
            staff.StaffRole === "Staff" &&
            staff.MainPosition === "Software Developer"
        );
        if (result.length > 0) {
          return {
            errCode: 0,
            data: result,
            message: "dev found",
          };
        }
        return {
          errCode: 1,
          data: [],
          message: "dev not found",
        };
      case "tester":
        result = res.data.filter(
          (staff) =>
            staff.StaffRole === "Staff" &&
            staff.MainPosition === "Software Tester"
        );
        if (result.length > 0) {
          return {
            errCode: 0,
            data: result,
            message: "tester found",
          };
        }
        return {
          errCode: 1,
          data: [],
          message: "tester not found",
        };

      case "BA":
        result = res.data.filter(
          (staff) =>
            staff.StaffRole === "Staff" &&
            staff.MainPosition === "Business Analysis"
        );
        if (result.length > 0) {
          return {
            errCode: 0,
            data: result,
            message: "BA found",
          };
        }
        return {
          errCode: 1,
          data: [],
          message: "BA not found",
        };

      default:
        return {
          errCode: 2,
          data: result,
          message: "error in find progress",
        };
    }
  } catch (error) {
    console.error(error);
  }
};

export const exportExcel = async (id, token) => {
  try {
    let res = await axios.get(`${baseUrl}/api/Download/Project/${id}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("res>>>   ", res);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `Project_${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("error export excel>>>", error);
  }
};

export const loadMoreData = async (itemType, page, token) => {
  try {
    let res = [];
    if (itemType === "allStaff") {
      await axios
        .get(`${baseUrl}/api/staff/${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          res = response.data;
          return res;
        });
    } else if (itemType === "freeStaff") {
      await axios
        .get(`${baseUrl}/api/staffFree/${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          res = response.data;

          return res;
        });
    } else if (itemType === "inProjectStaff") {
      await axios
        .get(`${baseUrl}/api/allStaffInProject/${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          res = response.data;

          return res;
        });
    }
    return res;
  } catch (error) {
    console.error("error fetch more>>>", error);
  }
};

export const ConCatDataFetched = async (page, itemType, selectType, token) => {
  console.log("run into concat");
  console.log("itemType load more>>", itemType);
  console.log("page load more>>", page);
  console.log("selectType>>", selectType);

  let data = await loadMoreData(itemType, page, token);
  console.log(`data ${itemType}>>`, data);

  console.log("currentSelectType>>", selectType);

  if (data.length > 0) {
    console.log("data.length>>", data.length);

    // switch (selectType) {
    // case "1":
    if (selectType === "1") {
      console.log("run into case 1");

      let PMs = data.filter((staff) => staff.StaffRole === "Project Manager");
      console.log("PMs>>", PMs);
      if (PMs.length === 0) {
        return {
          errCode: 1,
          message: "You have reached the end of the list",
          newData: [],
        };
      }

      return {
        errCode: 0,
        message: "Load more success",
        newData: PMs,
      };
    }

    // case "2":
    if (selectType === "2") {
      console.log("run into case 2");
      let devs = data.filter(
        (staff) =>
          staff.StaffRole === "Staff" &&
          staff.MainPosition === "Software Developer"
      );
      console.log("devs>>", devs);
      if (devs.length === 0) {
        return {
          errCode: 1,
          message: "You have reached the end of the list",
          newData: [],
        };
      }

      return {
        errCode: 0,
        message: "Load more success",
        newData: devs,
      };
    }
    // case "3":
    if (selectType === "3") {
      console.log("run into case 3");
      let testers = data.filter(
        (staff) =>
          staff.StaffRole === "Staff" &&
          staff.MainPosition === "Software Tester"
      );
      console.log("testers>>", testers);
      if (testers.length === 0) {
        return {
          errCode: 1,
          message: "You have reached the end of the list",
          newData: [],
        };
      }

      return {
        errCode: 0,
        message: "Load more success",
        newData: testers,
      };
    }
    // case "4":
    if (selectType === "4") {
      console.log("run into case 4");
      let BAs = data.filter(
        (staff) =>
          staff.StaffRole === "Staff" &&
          staff.MainPosition === "Business Analysis"
      );

      console.log("BAs>>", BAs);
      if (BAs.length === 0) {
        return {
          errCode: 1,
          message: "You have reached the end of the list",
          newData: [],
        };
      }

      return {
        errCode: 0,
        message: "Load more success",
        newData: BAs,
      };
    }
    // default:
    //   break;
  }
  // }
};

export const searchStaffByName = async (option, type, name, page, token) => {
  try {
    console.log(
      "link will be called>>",
      `${baseUrl}/api/staff/search/${option}/${type}/${name}/${page} `
    );

    let res = await axios.get(
      `${baseUrl}/api/staff/search/${option}/${type}/${name}/${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("res search staff by name>>", res);
    if (res.data && res.data.length > 0) {
      return {
        errCode: 0,
        data: res.data,
        message: "search staff by name success",
      };
    } else {
      return {
        errCode: 1,
        data: [],
        message: "search staff by name fail",
      };
    }
  } catch (error) {
    console.error("error search staff by name>>", error);
  }
};

export const getPageOfSearchStaffByName = async (option, type, name, token) => {
  console.log(
    "link>>",
    `${baseUrl}/api/staff/searchPage/${option}/${type}/${name} `
  );

  try {
    let res = await axios.get(
      `${baseUrl}/api/staff/searchPage/${option}/${type}/${name}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("page search staff by name>>", res);
    if (res.data && res.data > 0) {
      return {
        errCode: 0,
        data: res.data,
        message: "page search staff by name success",
      };
    } else {
      return {
        errCode: 1,
        data: 0,
        message: "not page to get",
      };
    }
  } catch (error) {
    console.error("error page of search staff by name>>", error);
  }
};
