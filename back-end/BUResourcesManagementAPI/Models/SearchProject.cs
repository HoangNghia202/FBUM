using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class SearchProject
    {
        public String ProjectName { get; set; }
        public int ProjectManager { get; set; }
        public int[] BusinessAnalysis { get; set; }
        public int[] SoftwareDeveloper { get; set; }
        public int[] SoftwareTester { get; set; }
        public String TimeStart { get; set; }
        public String TimeEnd { get; set; }

        public SearchProject()
        {
        }

        public SearchProject(String projectName, int projectManager, int[] businessAnalysis, int[] softwareDeveloper, int[] softwareTester, String timeStart, String timeEnd)
        {
            this.ProjectName = projectName;
            this.ProjectManager = projectManager;
            this.BusinessAnalysis = businessAnalysis;
            this.SoftwareDeveloper = softwareDeveloper;
            this.SoftwareTester = softwareTester;
            this.TimeStart = timeStart;
            this.TimeEnd = timeEnd;
        }
    }
}