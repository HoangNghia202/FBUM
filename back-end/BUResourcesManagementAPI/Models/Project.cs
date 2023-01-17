using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        public String ProjectName { get; set; }
        public String TimeStart { get; set; }
        public String TimeEnd { get; set; }
        public List<Staff> Staffs { get; set; }

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

        public Project(int projectID, string projectName, string timeStart, string timeEnd, List<Staff> staffs) : this(projectID, projectName, timeStart, timeEnd)
        {
            Staffs = staffs;
        }

        public bool CheckValidProject()
        {
            if (ProjectName == null || ProjectName.Length == 0) return false;
            try
            {
                DateTime.Parse(TimeStart);
                DateTime.Parse(TimeEnd);
            }
            catch
            {
                return false;
            }
            DateTime dateTime = DateTime.Now;
            if (String.Compare(dateTime.ToString("yyyy-MM-dd"), TimeStart, true) > 0) return false;
            if (String.Compare(TimeStart, TimeEnd, 0) >= 0) return false;
            return true;
        }
    }
}