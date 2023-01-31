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
using System.Web.Management;

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

                String query = @"SELECT * FROM Project";

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
                            String manager = new StaffController().Get(reader.GetInt32(2)).StaffName;
                            String dateStart = reader.GetDateTime(3).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd));
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
                String query = @"SELECT * FROM Project WHERE ProjectID = @ProjectID";

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
                            String manager = new StaffController().Get(reader.GetInt32(2)).StaffName;
                            String dateStart = reader.GetDateTime(3).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            return new Project(projectID, projectName, manager, dateStart, dateEnd);
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

        [HttpGet] // api/staffFree
        [Route("api/staffFree")]
        public List<Staff> GetFreeStaff()
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID NOT IN (
                                SELECT Staff.StaffID FROM Staff, WorkOn, Project 
                                WHERE Staff.StaffID = WorkOn.StaffID AND 
                                Project.ProjectID = WorkOn.ProjectID AND 
                                WorkOn.WorkEnd = Project.TimeEnd AND 
                                GETDATE() <= Project.TimeEnd AND 
                                GETDATE() >= Project.TimeStart);";

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

        [HttpGet] // api/staffInProject
        [Route("api/staffInProject")]
        public List<Staff> GetInProjectStaff()
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID IN (
                                SELECT Staff.StaffID FROM Staff, WorkOn, Project 
                                WHERE Staff.StaffID = WorkOn.StaffID AND 
                                Project.ProjectID = WorkOn.ProjectID AND 
                                WorkOn.WorkEnd = Project.TimeEnd AND 
                                GETDATE() <= Project.TimeEnd AND 
                                GETDATE() >= Project.TimeStart);";

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
                                Staff.StaffRole = Role.RoleID AND 
                                Staff.MainPosition = Position.PositionID AND 
                                Staff.StaffID = WorkOn.StaffID AND 
                                Project.ProjectID = WorkOn.ProjectID AND 
                                WorkOn.WorkEnd = Project.TimeEnd AND
                                Project.ProjectID = @ProjectID";

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
                                SELECT a.StaffID FROM 
                                (SELECT WorkOn.ProjectID, StaffID, Position, WorkStart, WorkEnd, TimeStart, TimeEnd FROM WorkOn, Project WHERE WorkOn.ProjectID = Project.ProjectID) AS a, 
                                (SELECT ProjectID, TimeStart, TimeEnd FROM Project WHERE ProjectID = @ProjectID) AS b
                                WHERE 
                                (
                                ((a.WorkStart >= b.TimeStart AND a.WorkStart < b.TimeEnd) OR
                                (a.WorkEnd > b.TimeStart AND a.WorkEnd <= b.TimeEnd) OR
                                (a.WorkStart <= b.TimeStart AND a.WorkEnd >= b.TimeEnd)) AND 
                                a.ProjectID != @ProjectID AND a.WorkEnd = a.TimeEnd 
                                ) OR 
                                (a.WorkEnd = b.TimeEnd AND a.ProjectID = @ProjectID)
                                );";

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

        [HttpGet] // api/project/staff_available/{fromID}/{toID}
        [Route("api/project/staff_available/{fromID}/{toID}")]
        public List<Staff> GetStaffAvailable(int fromID, int toID)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT Staff.StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position, Project, WorkOn
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND Staff.StaffID = WorkOn.StaffID AND Project.ProjectID = WorkOn.ProjectID AND Project.ProjectID = @FromProjectID AND
                                Staff.StaffID IN (
                                SELECT StaffID FROM WorkOn, Project WHERE Project.ProjectID = @FromProjectID AND Project.ProjectID = WorkOn.ProjectID AND WorkOn.WorkEnd = Project.TimeEnd
                                ) AND
                                Staff.StaffID NOT IN (
                                SELECT a.StaffID FROM 
                                (SELECT WorkOn.ProjectID, StaffID, Position, WorkStart, WorkEnd, TimeStart, TimeEnd FROM WorkOn, Project WHERE WorkOn.ProjectID = Project.ProjectID) AS a,
                                (SELECT ProjectID, TimeStart, TimeEnd FROM Project WHERE ProjectID = @ToProjectID) AS b
                                WHERE 
                                (
                                ((a.WorkStart >= b.TimeStart AND a.WorkStart < b.TimeEnd) OR
                                (a.WorkEnd > b.TimeStart AND a.WorkEnd <= b.TimeEnd) OR
                                (a.WorkStart <= b.TimeStart AND a.WorkEnd >= b.TimeEnd)) AND 
                                a.ProjectID != @FromProjectID AND a.ProjectID != @ToProjectID AND a.WorkEnd = a.TimeEnd 
                                ) OR 
                                (a.WorkEnd = b.TimeEnd AND a.ProjectID = @ToProjectID)
                                );";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@ToProjectID", toID);
                    command.Parameters.AddWithValue("@FromProjectID", fromID);
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

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() >= TimeStart AND GETDATE() <= TimeEnd) 
                                SELECT * FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

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
                            int projectID = reader.GetInt32(1);
                            String projectName = reader.GetString(2);
                            String manager = new StaffController().Get(reader.GetInt32(3)).StaffName;
                            String dateStart = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(5).ToString("yyyy-MM-dd HH:mm:ss");
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
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

        [HttpGet] // api/projectInProgressPage
        [Route("api/projectInProgress")]
        public int GetProjectInProgressPage()
        {
            try
            {
                int rows = 0;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() >= TimeStart AND GETDATE() <= TimeEnd) 
                                SELECT COUNT(*) FROM NewTable;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            rows = reader.GetInt32(0);
                            if (rows % 10 == 0) return rows / 10;
                            else return rows / 10 + 1;
                        }
                    }
                    connection.Close();
                }

                return rows;
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
                                SELECT * FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

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
                            int projectID = reader.GetInt32(1);
                            String projectName = reader.GetString(2);
                            String manager = new StaffController().Get(reader.GetInt32(3)).StaffName;
                            String dateStart = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(5).ToString("yyyy-MM-dd HH:mm:ss");
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
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

        [HttpGet] // api/projectEndedPage
        [Route("api/projectEndedPage")]
        public int GetProjectEndedPage()
        {
            try
            {
                int rows = 0;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() > TimeEnd) 
                                SELECT COUNT(*) FROM NewTable;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            rows = reader.GetInt32(0);
                            if (rows % 10 == 0) return rows / 10;
                            else return rows / 10 + 1;
                        }
                    }
                    connection.Close();
                }

                return rows;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/projectInComing/page/{id}
        [Route("api/projectInComing/page/{id}")]
        public List<Project> GetProjectInComing(int id)
        {
            try
            {
                List<Project> listProject = null;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() < TimeStart) 
                                SELECT * FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

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
                            int projectID = reader.GetInt32(1);
                            String projectName = reader.GetString(2);
                            String manager = new StaffController().Get(reader.GetInt32(3)).StaffName;
                            String dateStart = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(5).ToString("yyyy-MM-dd HH:mm:ss");
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
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

        [HttpGet] // api/projectInComingPage
        [Route("api/projectInComingPage")]
        public int GetProjectInComingPage()
        {
            try
            {
                int rows = 0;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY TimeStart) AS RowNumber, * FROM Project WHERE GETDATE() < TimeStart) 
                                SELECT COUNT(*) FROM NewTable;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            rows = reader.GetInt32(0);
                            if (rows % 10 == 0) return rows / 10;
                            else return rows / 10 + 1;
                        }
                    }
                    connection.Close();
                }

                return rows;
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

                String query = @"SELECT * FROM Project WHERE ProjectName LIKE @Keyword";

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
                            String manager = new StaffController().Get(reader.GetInt32(2)).StaffName;
                            String dateStart = reader.GetDateTime(3).ToString("yyyy-MM-dd HH:mm:ss");
                            String dateEnd = reader.GetDateTime(4).ToString("yyyy-MM-dd HH:mm:ss");
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
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

                String query = @"INSERT INTO Project VALUES (@ProjectName, @Manager, @TimeStart, @TimeEnd);";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@ProjectName", project.ProjectName);
                    command.Parameters.AddWithValue("@Manager", int.Parse(project.Manager));
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
        public String MoveStaff(int fromID, int toID, [FromBody] Values staffIDs)
        {
            try
            {
                String[] ids = staffIDs.Value.Split(',');

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

        [HttpPut] // api/insertToProject/{projectID}/{staffID}
        [Route("api/insertToProject/{projectID}/{staffID}")]
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
                    command.Parameters.AddWithValue("@Position", new PositionController().GetPositionIDToString(staff.MainPosition));
                    DateTime dateTime = DateTime.Now;
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd HH:mm:ss"), project.TimeEnd, true) >= 0)
                    {
                        return "Can't add staff to this project. Project was done";
                    }
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd HH:mm:ss"), project.TimeStart, true) <= 0)
                    {
                        command.Parameters.AddWithValue("@TimeStart", project.TimeStart);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@TimeStart", dateTime.ToString("yyyy-MM-dd HH:mm:ss"));
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

        [HttpDelete] // api/deleteStaffInProject/{projectID}/{staffID}
        [Route("api/deleteStaffInProject/{projectID}/{staffID}")]
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
                    if (String.Compare(dateTime.ToString("yyyy-MM-dd HH:mm:ss"), project.TimeEnd, true) > 0)
                    {
                        return "Project was done";
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@WorkEnd", dateTime.ToString("yyyy-MM-dd HH:mm:ss"));
                        command.Parameters.AddWithValue("@ProjectID", projectID);
                        command.Parameters.AddWithValue("@StaffID", staffID);
                    }
                    if (command.ExecuteNonQuery() != 1) return "Delete staff in project failed";
                    else return "Delete staff in project successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
