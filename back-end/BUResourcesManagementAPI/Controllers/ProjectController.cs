using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BUResourcesManagementAPI.Models;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace BUResourcesManagementAPI.Controllers
{
    public class ProjectController : ApiController
    {
        public ProjectController() { }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            DataTable dataTable = new DataTable();

            String query = @"SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd FROM Project";

            using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
            using (var command = new SqlCommand(query, connection))
            using (var data = new SqlDataAdapter(command))
            {
                command.CommandType = CommandType.Text;
                data.Fill(dataTable);
            }

            return Request.CreateResponse(HttpStatusCode.OK, dataTable);
        }

        [HttpGet]
        public HttpResponseMessage GetStaffAvailable(int id)
        {
            DataTable dataTable = new DataTable();

            String query = @"SELECT * FROM Staff WHERE StaffID NOT IN (
                            SELECT StaffID FROM WorkOn, (
                            SELECT a.ProjectID
                            FROM Project AS a, (SELECT ProjectID, TimeStart, TimeEnd FROM Project WHERE ProjectID = " + id + @") AS b
                            WHERE 
                            (a.TimeStart > b.TimeStart AND a.TimeStart < b.TimeEnd) OR 
                            (a.TimeEnd > b.TimeStart AND a.TimeEnd < b.TimeEnd) OR
                            (a.TimeStart < b.TimeStart AND a.TimeEnd > b.TimeEnd) OR
                            (a.TimeStart > b.TimeStart AND a.TimeEnd < b.TimeEnd)) as c
                            WHERE WorkOn.ProjectID = c.ProjectID);";

            using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
            using (var command = new SqlCommand(query, connection))
            using (var data = new SqlDataAdapter(command))
            {
                command.CommandType = CommandType.Text;
                data.Fill(dataTable);
            }

            return Request.CreateResponse(HttpStatusCode.OK, dataTable);
        }

        [HttpPost]
        public String Post(Project project)
        {
            try
            {
                DataTable dataTable = new DataTable();

                String query = @"INSERT INTO Project VALUES ('" + project.ProjectName + @"', '" + project.TimeStart + @"', '" + project.TimeEnd + @"');";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                using (var data = new SqlDataAdapter(command))
                {
                    command.CommandType = CommandType.Text;
                    data.Fill(dataTable);
                }

                return "Project was added successfully";
            }
            catch (Exception ex)
            {
                return $"Error\n{ex}";
            }
        }

        [HttpPost]
        [Route("api/project/{projectID}/{staffID}")]
        public String PostStaff(int projectID, int staffID)
        {
            try
            {
                DataTable dataTable = new DataTable();

                String query = @"INSERT INTO WorkOn VALUES ('" + projectID + @"', '" + staffID + @"');";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                using (var data = new SqlDataAdapter(command))
                {
                    command.CommandType = CommandType.Text;
                    data.Fill(dataTable);
                }

                return "Staff was added to project successfully";
            }
            catch (Exception ex)
            {
                return $"Error\n{ex}";
            }
        }
    }
}
