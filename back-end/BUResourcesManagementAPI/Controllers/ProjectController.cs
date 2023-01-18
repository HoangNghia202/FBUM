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

namespace BUResourcesManagementAPI.Controllers
{
    public class ProjectController : ApiController
    {

        [HttpGet] // api/project
        public List<Project> Get()
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
                    }
                    connection.Close();
                }

                return listProject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/project/{id}
        public Project Get(int id)
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
                            return new Project(projectID, projectName, dateStart, dateEnd);
                        }
                    }
                    connection.Close();
                }

                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/staffInProject/{id}
        [Route("api/staffInProject/{id}")]
        public List<Staff> GetStaff(int id)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT Staff.StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position, Project, WorkOn
                            WHERE 
                            Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND Staff.StaffID = WorkOn.StaffID AND Project.ProjectID = WorkOn.ProjectID AND Project.ProjectID = @ProjectID";

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
                    }
                    connection.Close();
                }

                return listStaff;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/project/staff_available/{id}
        [Route("api/project/staff_available/{id}")]
        public List<Staff> GetStaffAvailable(int id)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID NOT IN (
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
                    }
                    connection.Close();
                }

                return listStaff;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/projectInProgress/page/{id}
        [Route("api/projectInProgress/page/{id}")]
        public List<Project> GetProjectInProgress(int id)
        {
            try
            {
                List<Project> listProject = null;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() <= TimeEnd) 
                                SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Start", 10 * id - 9);
                    command.Parameters.AddWithValue("@End", 10 * id);
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, dateStart, dateEnd, listStaff));
                        }
                    }
                    connection.Close();
                }

                return listProject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/projectEnded/page/{id}
        [Route("api/projectEnded/page/{id}")]
        public List<Project> GetProjectEnded(int id)
        {
            try
            {
                List<Project> listProject = null;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() > TimeEnd) 
                                SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Start", 10 * id - 9);
                    command.Parameters.AddWithValue("@End", 10 * id);
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, dateStart, dateEnd, listStaff));
                        }
                    }
                    connection.Close();
                }

                return listProject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/project/search/{keyword}
        [Route("api/project/search/{keyword}")]
        public List<Project> Search(String keyword)
        {
            try
            {
                List<Project> listProject = null;

                String query = @"SELECT ProjectID, ProjectName, CONVERT(VARCHAR(10), TimeStart) AS TimeStart, CONVERT(VARCHAR(10), TimeEnd) AS TimeEnd FROM Project WHERE ProjectName LIKE @Keyword";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Keyword", "%" + keyword + "%");
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, dateStart, dateEnd, listStaff));
                        }
                    }
                    connection.Close();
                }

                return listProject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost] // api/createProject
        [Route("api/createProject")]
        public String Post(Project project)
        {
            try
            {
                if (!project.CheckValidProject()) return "Project's information is invalid";

                String query = @"INSERT INTO Project VALUES (@ProjectName, @TimeStart, @TimeEnd);";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@ProjectName", project.ProjectName);
                    command.Parameters.AddWithValue("@TimeStart", project.TimeStart);
                    command.Parameters.AddWithValue("@TimeEnd", project.TimeEnd);
                    if (command.ExecuteNonQuery() != 1) return "Create new project failed";
                    else return "Create new project successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPost] // api/transfer/{fromId}/{toId}
        [Route("api/transfer/{fromId}/{toId}")]
        public String MoveStaff(int fromID, int toID, [FromBody] String staffIDs)
        {
            try
            {
                String[] ids = staffIDs.Split(',');

                foreach (String id in ids)
                {
                    Delete(fromID, int.Parse(id.Trim()));
                    PutStaff(toID, int.Parse(id.Trim()));
                }
                return "Move staff successfully";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPut] // api/insertToFroject/{projectID}/{staffID}
        [Route("api/insertToFroject/{projectID}/{staffID}")]
        public String PutStaff(int projectID, int staffID)
        {
            try
            {
                Project project = Get(projectID);
                Staff staff = new StaffController().Get(staffID);

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
                        return "Can't add staff to this project. Project was done";
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
                    if (command.ExecuteNonQuery() != 1) return "Add staff to project failed";
                    else return "Add staff to project successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpDelete] // api/deleteProject/{id}
        [Route("api/deleteProject/{id}")]
        public String Delete(int id)
        {
            try
            {
                String query = @"DELETE FROM Project WHERE ProjectID = @ProjectID;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@ProjectID", id);
                    if (command.ExecuteNonQuery() != 1) return "Delete project failed";
                    else return "Delete project successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpDelete] // api/deleteStaffInproject/{projectID}/{staffID}
        [Route("api/deleteStaffInproject/{projectID}/{staffID}")]
        public String Delete(int projectID, int staffID)
        {
            try
            {
                Project project = Get(projectID);

                String query = @"UPDATE WorkOn SET WorkEnd = @WorkEnd WHERE ProjectID = @ProjectID AND StaffID = @StaffID;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    DateTime dateTime = DateTime.Now;
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd"), project.TimeEnd, true) > 0)
                    {
                        return "Project was done";
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@WorkEnd", dateTime.ToString("yyyy-MM-dd"));
                        command.Parameters.AddWithValue("@ProjectID", projectID);
                        command.Parameters.AddWithValue("@ProjectID", staffID);
                    }
                    if (command.ExecuteNonQuery() != 1) return "Delete project failed";
                    else return "Delete project successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
