import { advanceSearchProject } from "../adminServices/AdminServices";

export const findProjectByPMId = async (id, token) => {
    let modelFind = {
        projectName: "",
        PM: id,
        dev: [],
        BA: [],
        tester: [],
        startDate: "",
        endDate: "",
    };
    let res = await advanceSearchProject(modelFind, token);
    if (res.errCode === 0) {
        let nowProject = res.data.filter(
            (item) =>
                Date.now() > Date.parse(item.TimeStart) &&
                Date.now() < Date.parse(item.TimeEnd)
        )[0];
        let incomingProject = res.data.filter(
            (item) => Date.now() < Date.parse(item.TimeStart)
        );
        return {
            errCode: 0,
            data: {
                nowProject: nowProject,
                incomingProject: incomingProject,
            },
            message: " get project by PM id successfully",
        };
    }
    return res;
};
