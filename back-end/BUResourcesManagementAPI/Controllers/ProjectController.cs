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
using DocumentFormat.OpenXml.Office2010.Excel;
using ClosedXML.Excel;
using System.IO;

namespace BUResourcesManagementAPI.Controllers
{
    public class ProjectController : ApiController
    {
        [HttpGet] // api/project
        public List<Project> Get()
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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

        [HttpGet] // api/staffInProject/{id}
        [Route("api/staffInProject/{id}")]
        public List<Staff> GetStaff(int id)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
        [Route("api/projectInProgressPage")]
        public int GetProjectInProgressPage()
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return 0;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return 0;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return 0;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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

        [HttpGet] // api/Export/Project/{id}/{path}
        [Route("api/Export/Project/{id}/{path}")]
        public String ExportExcel(int id, String path)
        {
            try
            {
                ProjectController projectController = new ProjectController();
                Project project = projectController.Get(id);
                List<Staff> staffs = projectController.GetStaff(id);

                DataTable projectTable = new DataTable();
                projectTable.TableName = "Project Information";

                projectTable.Columns.Add("Project ID", typeof(int));
                projectTable.Columns.Add("Project Name", typeof(String));
                projectTable.Columns.Add("Manager", typeof(String));
                projectTable.Columns.Add("Start Date", typeof(String));
                projectTable.Columns.Add("End Date", typeof(String));
                projectTable.Columns.Add("Export Date", typeof(String));

                projectTable.Rows.Add(project.ProjectID, project.ProjectName, project.Manager, project.TimeStart, project.TimeEnd, String.Format("{0:yyyy-MM-dd hh:mm:ss}", DateTimeOffset.Now));

                DataTable staffTable = new DataTable();
                staffTable.TableName = "Staff In Project";

                staffTable.Columns.Add("Staff ID", typeof(int));
                staffTable.Columns.Add("Staff Name", typeof(String));

                foreach (Staff staff in staffs) staffTable.Rows.Add(staff.StaffID, staff.StaffName);

                if (!Directory.Exists(path)) path = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "\\Downloads";
                String fileName = path + "\\Project" + project.ProjectID + ".xlsx";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(projectTable);
                    wb.Worksheets.Add(staffTable);
                    wb.SaveAs(fileName);
                }
                return "Project was exported at " + path;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPost] // api/project/multiOptionSearch
        [Route("api/project/multiOptionSearch")]
        public IEnumerable<Project> MultiOptionSearch([FromBody] SearchProject searchProject)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
            try
            {
                var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString);
                connection.Open();

                if (searchProject.ProjectName.Equals("") &&
                    searchProject.ProjectManager == 0 &&
                    searchProject.BusinessAnalysis.Length == 0 &&
                    searchProject.SoftwareDeveloper.Length == 0 &&
                    searchProject.SoftwareTester.Length == 0 &&
                    searchProject.TimeStart.Equals("") &&
                    searchProject.TimeEnd.Equals("")) return new List<Project>();

                List<Project> listProject = new List<Project>();
                if (true)
                {
                    String query = @"SELECT * FROM Project ORDER BY TimeStart";
                    var command = new SqlCommand(query, connection);
                    command.CommandType = CommandType.Text;
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                        }
                    }
                    reader.Close();
                }

                //ProjectName Option
                List<Project> listProject1 = new List<Project>();
                if (!searchProject.ProjectName.Equals(""))
                {
                    String query = @"SELECT * FROM Project WHERE ProjectName LIKE @ProjectName";
                    var command = new SqlCommand(query, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@ProjectName", "%" + searchProject.ProjectName + "%");
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject1.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
                        }
                    }
                    reader.Close();
                }
                else
                {
                    listProject1 = listProject;
                }

                //ProjectManager Option
                List<Project> listProject2 = new List<Project>();
                if (!(searchProject.ProjectManager == 0))
                {
                    String query = @"SELECT * FROM Project WHERE Manager = @Manager";
                    var command = new SqlCommand(query, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Manager", searchProject.ProjectManager);
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject2.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));
                        }
                    }
                    reader.Close();
                }
                else
                {
                    listProject2 = listProject;
                }

                //BusinessAnalysis Option
                List<Project> listProject3 = new List<Project>();
                if (!(searchProject.BusinessAnalysis.Length == 0))
                {
                    for (int i = 0; i < searchProject.BusinessAnalysis.Length; i++)
                    {
                        String query = @"SELECT Project.ProjectID, ProjectName, Manager, TimeStart, TimeEnd FROM Project, WorkOn 
                                        WHERE Project.ProjectID = WorkOn.ProjectID AND WorkOn.StaffID = @StaffID";
                        var command = new SqlCommand(query, connection);
                        command.CommandType = CommandType.Text;
                        command.Parameters.AddWithValue("@StaffID", searchProject.BusinessAnalysis[i]);
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
                                List<Staff> listStaff = GetStaff(projectID);
                                listProject3.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                            }
                        }
                        reader.Close();
                    }
                }
                else
                {
                    listProject3 = listProject;
                }

                //SoftwareDeveloper Option
                List<Project> listProject4 = new List<Project>();
                if (!(searchProject.SoftwareDeveloper.Length == 0))
                {
                    for (int i = 0; i < searchProject.SoftwareDeveloper.Length; i++)
                    {
                        String query = @"SELECT Project.ProjectID, ProjectName, Manager, TimeStart, TimeEnd FROM Project, WorkOn 
                                        WHERE Project.ProjectID = WorkOn.ProjectID AND WorkOn.StaffID = @StaffID";
                        var command = new SqlCommand(query, connection);
                        command.CommandType = CommandType.Text;
                        command.Parameters.AddWithValue("@StaffID", searchProject.SoftwareDeveloper[i]);
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
                                List<Staff> listStaff = GetStaff(projectID);
                                listProject4.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                            }
                        }
                        reader.Close();
                    }
                }
                else
                {
                    listProject4 = listProject;
                }

                //SoftwareTester Option
                List<Project> listProject5 = new List<Project>();
                if (!(searchProject.SoftwareTester.Length == 0))
                {
                    for (int i = 0; i < searchProject.SoftwareTester.Length; i++)
                    {
                        String query = @"SELECT Project.ProjectID, ProjectName, Manager, TimeStart, TimeEnd FROM Project, WorkOn 
                                        WHERE Project.ProjectID = WorkOn.ProjectID AND WorkOn.StaffID = @StaffID";
                        var command = new SqlCommand(query, connection);
                        command.CommandType = CommandType.Text;
                        command.Parameters.AddWithValue("@StaffID", searchProject.SoftwareTester[i]);
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
                                List<Staff> listStaff = GetStaff(projectID);
                                listProject5.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                            }
                        }
                        reader.Close();
                    }
                }
                else
                {
                    listProject5 = listProject;
                }

                //TimeStart Option
                List<Project> listProject6 = new List<Project>();
                if (!searchProject.TimeStart.Equals(""))
                {
                    String query = @"SELECT * FROM Project WHERE TimeStart >= @TimeStart";
                    var command = new SqlCommand(query, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@TimeStart", searchProject.TimeStart);
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject6.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                        }
                    }
                    reader.Close();
                }
                else
                {
                    listProject6 = listProject;
                }

                //TimeEnd Option
                List<Project> listProject7 = new List<Project>();
                if (!searchProject.TimeEnd.Equals(""))
                {
                    String query = @"SELECT * FROM Project WHERE TimeEnd <= @TimeEnd";
                    var command = new SqlCommand(query, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@TimeEnd", searchProject.TimeEnd);
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
                            List<Staff> listStaff = GetStaff(projectID);
                            listProject7.Add(new Project(projectID, projectName, manager, dateStart, dateEnd, listStaff));

                        }
                    }
                    reader.Close();
                }
                else
                {
                    listProject7 = listProject;
                }

                connection.Close();
                //LINQ
                var result = from list in listProject
                             where
                             listProject1.Any(list1 => list1.ProjectID == list.ProjectID) &&
                             listProject2.Any(list2 => list2.ProjectID == list.ProjectID) &&
                             listProject3.Any(list3 => list3.ProjectID == list.ProjectID) &&
                             listProject4.Any(list4 => list4.ProjectID == list.ProjectID) &&
                             listProject5.Any(list5 => list5.ProjectID == list.ProjectID) &&
                             listProject6.Any(list6 => list6.ProjectID == list.ProjectID) &&
                             listProject7.Any(list7 => list7.ProjectID == list.ProjectID)
                             select list;
                return result;
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't access this resource";
            try
            {
                if (!project.CheckValidProject()) return "Project's information is invalid";

                String query1 = @"INSERT INTO Project VALUES (@ProjectName, @Manager, @TimeStart, @TimeEnd);";
                String query2 = @"SELECT TOP 1 ProjectID FROM Project ORDER BY ProjectID DESC;";
                String query3 = @"INSERT INTO WorkOn VALUES (@ProjectID, @StaffID, @Position, @TimeStart, @TimeEnd);";

                var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString);

                var command1 = new SqlCommand(query1, connection);
                var command2 = new SqlCommand(query2, connection);
                var command3 = new SqlCommand(query3, connection);

                connection.Open();

                command1.Parameters.AddWithValue("@ProjectName", project.ProjectName);
                command1.Parameters.AddWithValue("@Manager", int.Parse(project.Manager));
                command1.Parameters.AddWithValue("@TimeStart", project.TimeStart);
                command1.Parameters.AddWithValue("@TimeEnd", project.TimeEnd);
                if (command1.ExecuteNonQuery() != 1) return "Create new project failed";

                var reader = command2.ExecuteReader();
                int projectID = 0;
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        projectID = reader.GetInt32(0);
                    }
                }
                reader.Close();

                Staff manager = new StaffController().Get(int.Parse(project.Manager));
                command3.Parameters.AddWithValue("@ProjectID", projectID);
                command3.Parameters.AddWithValue("@StaffID", manager.StaffID);
                command3.Parameters.AddWithValue("@Position", int.Parse(new PositionController().GetPositionIDToString(manager.MainPosition)));
                command3.Parameters.AddWithValue("@TimeStart", project.TimeEnd);
                command3.Parameters.AddWithValue("@TimeEnd", project.TimeEnd);
                if (command3.ExecuteNonQuery() != 1) return "Create new project failed";

                connection.Close();
                return "Create new project successfully";

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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't access this resource";
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't access this resource";
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't access this resource";
            try
            {
                String query1 = @"DELETE FROM WorkOn WHERE ProjectID = @ProjectID;";
                String query2 = @"DELETE FROM Project WHERE ProjectID = @ProjectID;";

                var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString);
                var command1 = new SqlCommand(query1, connection);
                var command2 = new SqlCommand(query2, connection);

                connection.Open();
                command1.Parameters.AddWithValue("@ProjectID", id);
                command2.Parameters.AddWithValue("@ProjectID", id);
                command1.ExecuteNonQuery();
                if (command2.ExecuteNonQuery() != 1) return "Delete project failed";
                else return "Delete project successfully";
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
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't access this resource";
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
