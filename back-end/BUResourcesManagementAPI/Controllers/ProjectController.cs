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
using Antlr.Runtime.Misc;
using System.Collections;
using BUResourcesManagementAPI.Models;

namespace BUResourcesManagementAPI.Controllers
{
    public class ProjectController : ApiController
    {

        [HttpGet] // api/project
        public HttpResponseMessage Get()
        {
            try
            {
                List<Project> listProject = null;

                String query = @"SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd FROM Project";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        listProject = new List<Project>();
                        while (reader.Read())
                        {
                            int projectID = reader.GetInt32(0);
                            String projectName = reader.GetString(1);
                            String dateStart = reader.GetString(2);
                            String dateEnd = reader.GetString(3);
                            listProject.Add(new Project(projectID, projectName, dateStart, dateEnd));
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return Request.CreateResponse(HttpStatusCode.NotFound, listProject);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, listProject);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet] // api/project/{id}
        public HttpResponseMessage Get(int id)
        {
            try
            {


                Project project = null;

                String query = @"SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd 
                            FROM Project WHERE ProjectID = @ProjectID";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("ProjectID", id);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int projectID = reader.GetInt32(0);
                            String projectName = reader.GetString(1);
                            String dateStart = reader.GetString(2);
                            String dateEnd = reader.GetString(3);
                            project = new Project(projectID, projectName, dateStart, dateEnd);
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return Request.CreateResponse(HttpStatusCode.NotFound, project);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, project);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet] // api/project/staff/{id}
        [Route("api/project/staff")]
        public HttpResponseMessage GetStaff(int id)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT Staff.StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position, Project, WorkOn
                            WHERE 
                            Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND Staff.StaffID = WorkOn.StaffID AND Project.ProjectID = WorkOn.ProjectID AND Project.ProjectID = " + id;

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        listStaff = new List<Staff>();
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            listStaff.Add(new Staff(staffID, staffName, password, staffRole, level, mainPosition));
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return Request.CreateResponse(HttpStatusCode.NotFound, listStaff);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, listStaff);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet] // api/project/staff_available/{id}
        [Route("api/project/staff_available")]
        public HttpResponseMessage GetStaffAvailable(int id)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT * FROM Staff WHERE StaffID NOT IN (
                                SELECT a.StaffID
                                FROM WorkOn AS a, (SELECT ProjectID, TimeStart, TimeEnd FROM Project WHERE ProjectID = @ProjectID) AS b
                                WHERE 
                                (a.WorkStart >= b.TimeStart AND a.WorkStart < b.TimeEnd) OR
                                (a.WorkEnd > b.TimeStart AND a.WorkEnd <= b.TimeEnd) OR
                                (a.WorkStart <= b.TimeStart AND a.WorkEnd >= b.TimeEnd));";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@ProjectID", id);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        listStaff = new List<Staff>();
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            listStaff.Add(new Staff(staffID, staffName, password, staffRole, level, mainPosition));
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return Request.CreateResponse(HttpStatusCode.NotFound, listStaff);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, listStaff);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost] // api/project
        public HttpResponseMessage Post(Project project)
        {
            try
            {
                String query = @"INSERT INTO Project VALUES (@ProjectName, @TimeStart, @TimeEnd);";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@ProjectName", project.ProjectName);
                    command.Parameters.AddWithValue("@TimeStart", project.TimeStart);
                    command.Parameters.AddWithValue("@TimeEnd", project.TimeEnd);
                    if (command.ExecuteNonQuery() != 1) return Request.CreateErrorResponse(HttpStatusCode.ExpectationFailed, "Create new project failed");
                    else return Request.CreateResponse(HttpStatusCode.OK, "Create new project successfully");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPut] // api/project/{projectID}/{staffID}
        [Route("api/project/{projectID}/{staffID}")]
        public HttpResponseMessage PutStaff(int projectID, int staffID)
        {
            try
            {
                Staff staff = new Staff().GetStaff(projectID);
                Project project = new Project().GetProject(projectID);

                String query = @"INSERT INTO WorkOn VALUES (@ProjectID, @StaffID, @Position, @TimeStart, @TimeEnd);";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@ProjectID", projectID);
                    command.Parameters.AddWithValue("@StaffID", staffID);
                    command.Parameters.AddWithValue("@Position", staff.MainPosition);
                    DateTime dateTime = DateTime.Now;
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd"), project.TimeEnd, true) >= 0)
                    {
                        throw new Exception("Project was done");
                    }
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd"), project.TimeStart, true) <= 0)
                    {
                        command.Parameters.AddWithValue("@TimeStart", project.TimeStart);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@TimeStart", dateTime.ToString("yyyy-MM-dd"));
                    }
                    command.Parameters.AddWithValue("@TimeEnd", project.TimeEnd);
                    if (command.ExecuteNonQuery() != 1) return Request.CreateErrorResponse(HttpStatusCode.ExpectationFailed, "Add staff to project failed");
                    else return Request.CreateResponse(HttpStatusCode.OK, "Add staff to project successfully");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        
    }
}
