using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        public String ProjectName { get; set; }
        public String TimeStart { get; set; }
        public String TimeEnd { get; set; }

        public Project() { }

        public Project(string projectName, string timeStart, string timeEnd)
        {
            ProjectName = projectName;
            TimeStart = timeStart;
            TimeEnd = timeEnd;
        }

        public Project(int projectID, string projectName, string timeStart, string timeEnd)
        {
            ProjectID = projectID;
            ProjectName = projectName;
            TimeStart = timeStart;
            TimeEnd = timeEnd;
        }
    }
}