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

        public Project GetProject(int projectID)
        {
            try
            {
                String query = @"SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd 
                            FROM Project WHERE ProjectID = @ProjectID";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("ProjectID", projectID);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            projectID = reader.GetInt32(0);
                            String projectName = reader.GetString(1);
                            String dateStart = reader.GetString(2);
                            String dateEnd = reader.GetString(3);
                            return new Project(projectID, projectName, dateStart, dateEnd);
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return null;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}