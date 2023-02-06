using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BUResourcesManagementAPI.Models;
using System.Web.ModelBinding;
using Antlr.Runtime.Misc;
using BUResourcesManagementAPI.TokenAuthentication;

namespace BUResourcesManagementAPI.Controllers
{
    public class StaffController : ApiController
    {
        [HttpGet] // api/staff
        [Route("api/staff")]
        public List<Staff> Get()
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID;";

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

        [HttpGet] // api/staff/id
        public Staff Get(int id)
        {
            try
            {
                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID = @StaffID";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@StaffID", id);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            return new Staff(staffID, staffName, password, staffRole, level, mainPosition);
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

        [HttpGet] // api/staff/search/{keyword}/{page}
        [Route("api/staff/search/{keyword}/{page}")]
        public List<Staff> Search(String keyword, int page)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
            try
            {
                List<Staff> listStaff = null;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY StaffName) AS RowNumber, StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position 
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffName LIKE @Keyword) 
                                SELECT * FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Keyword", "%" + keyword + "%");
                    command.Parameters.AddWithValue("@Start", (page - 1) * 10 + 1);
                    command.Parameters.AddWithValue("@End", page * 10);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        listStaff = new List<Staff>();
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(1);
                            String staffName = reader.GetString(2);
                            String password = reader.GetString(3);
                            String staffRole = reader.GetString(4);
                            int level = reader.GetInt32(5);
                            String mainPosition = reader.GetString(6);
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

        [HttpGet] // api/staff/search/{keyword}
        [Route("api/staff/search/{keyword}")]
        public int SearchPage(String keyword)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return 0;
            try
            {
                int rows = 0;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY StaffName) AS RowNumber, StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position 
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffName LIKE @Keyword) 
                                SELECT COUNT(*) FROM NewTable;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Keyword", "%" + keyword + "%");
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

        [HttpGet] // api/staffFree
        [Route("api/staffFree")]
        public List<Staff> GetFreeStaff()
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
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

        [HttpGet] // api/allStaffInProject/{id}
        [Route("api/allStaffInProject/{id}")]
        public List<Staff> GetInProjectStaff(int id)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
            try
            {
                List<Staff> listStaff = null;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY StaffName) AS RowNumber, StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID IN (
                                SELECT Staff.StaffID FROM Staff, WorkOn, Project 
                                WHERE Staff.StaffID = WorkOn.StaffID AND 
                                Project.ProjectID = WorkOn.ProjectID AND 
                                WorkOn.WorkEnd = Project.TimeEnd AND 
                                GETDATE() <= Project.TimeEnd AND 
                                GETDATE() >= Project.TimeStart))
								SELECT * FROM NewTable WHERE RowNumber BETWEEN @Start AND @End;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Start", id * 10 - 9);
                    command.Parameters.AddWithValue("@End", id * 10);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        listStaff = new List<Staff>();
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(1);
                            String staffName = reader.GetString(2);
                            String password = reader.GetString(3);
                            String staffRole = reader.GetString(4);
                            int level = reader.GetInt32(5);
                            String mainPosition = reader.GetString(6);
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

        [HttpGet] // api/allStaffInProject
        [Route("api/allStaffInProject")]
        public int GetInProjectStaffPage()
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return 0;
            try
            {
                int rows = 0;

                String query = @"WITH NewTable AS (SELECT ROW_NUMBER() OVER(ORDER BY StaffName) AS RowNumber, StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID IN (
                                SELECT Staff.StaffID FROM Staff, WorkOn, Project 
                                WHERE Staff.StaffID = WorkOn.StaffID AND 
                                Project.ProjectID = WorkOn.ProjectID AND 
                                WorkOn.WorkEnd = Project.TimeEnd AND 
                                GETDATE() <= Project.TimeEnd AND 
                                GETDATE() >= Project.TimeStart))
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

        [HttpPost] // api/staffManagerFree
        [Route("api/staffManagerFree")]
        public List<Staff> GetManagerFree([FromBody] Values time)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return null;
            try
            {
                String timeStart = time.Value.Split(',')[0].Trim();
                String timeEnd = time.Value.Split(',')[1].Trim();
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND RoleName = 'Project Manager' AND StaffID NOT IN (
                                SELECT a.StaffID FROM 
                                (SELECT WorkOn.ProjectID, StaffID, Position, WorkStart, WorkEnd, TimeStart, TimeEnd FROM WorkOn, Project WHERE WorkOn.ProjectID = Project.ProjectID) AS a
                                WHERE 
                                (
                                ((a.WorkStart >= @TimeStart AND a.WorkStart < @TimeEnd) OR
                                (a.WorkEnd > @TimeStart AND a.WorkEnd <= @TimeEnd) OR
                                (a.WorkStart <= @TimeStart AND a.WorkEnd >= @TimeEnd)) AND a.WorkEnd = a.TimeEnd));";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@TimeStart", timeStart);
                    command.Parameters.AddWithValue("@TimeEnd", timeEnd);
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

        [HttpPost] // api/createNewStaff
        [Route("api/createNewStaff")]
        public String Post([FromBody] Staff staff)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't not access this resource";
            try
            {
                if (!staff.CheckValidStaff()) return "Staff's information is invalid";

                String query = @"INSERT INTO Staff VALUES (@StaffName, @Password, @StaffRole, @Level, @MainPosition)";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffName", staff.StaffName);
                    command.Parameters.AddWithValue("@Password", staff.Password);
                    command.Parameters.AddWithValue("@StaffRole", int.Parse(staff.StaffRole));
                    command.Parameters.AddWithValue("@Level", staff.Level);
                    command.Parameters.AddWithValue("@MainPosition", int.Parse(staff.MainPosition));
                    if (command.ExecuteNonQuery() != 1) return "Create new staff failed";
                    else return "Create new staff successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPost]
        [Route("api/login")] // api/login
        public Staff Login([FromBody] Staff staff)
        {
            try
            {
                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position  
                                WHERE 
                                Staff.StaffRole = Role.RoleID AND 
                                Staff.MainPosition = Position.PositionID AND
                                StaffID = @StaffID AND 
                                Password = @Password;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffID", staff.StaffID);
                    command.Parameters.AddWithValue("@Password", staff.Password);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            return new Staff(staffID, staffName, password, staffRole, level, mainPosition);
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

        [HttpPut] // api/updateStaff
        [Route("api/updateStaff")]
        public String Put([FromBody] Staff staff)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't not access this resource";
            try
            {
                if (!staff.CheckValidStaff()) return "Staff's information is invalid";

                String query = @"UPDATE Staff SET 
                            StaffName = @StaffName, 
                            Password =  @Password,
                            StaffRole = @StaffRole,
                            Level = @Level,
                            MainPosition = @MainPosition 
                            WHERE StaffID = @StaffID;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffName", staff.StaffName);
                    command.Parameters.AddWithValue("@Password", staff.Password);
                    command.Parameters.AddWithValue("@StaffRole", staff.StaffRole);
                    command.Parameters.AddWithValue("@Level", staff.Level);
                    command.Parameters.AddWithValue("@MainPosition", staff.MainPosition);
                    command.Parameters.AddWithValue("@StaffID", staff.StaffID);
                    if (command.ExecuteNonQuery() != 1) return "Update staff failed";
                    else return "Update staff successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpDelete] // api/deleteStaff/{id}
        [Route("api/deleteStaff/{id}")]
        public String Delete(int id)
        {
            if (new SecurityController().Authorization(new List<String>() { "Admin" }) == false) return "Can't not access this resource";
            try
            {
                String query1 = @"DELETE FROM WorkOn WHERE StaffID = @StaffID;";
                String query2 = @"DELETE FROM Staff WHERE StaffID = @StaffID;";

                var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString);
                var command1 = new SqlCommand(query1, connection);
                var command2 = new SqlCommand(query2, connection);

                connection.Open();
                command1.Parameters.AddWithValue("@StaffID", id);
                command2.Parameters.AddWithValue("@StaffID", id);
                command1.ExecuteNonQuery();
                if (command2.ExecuteNonQuery() != 1) return "Delete staff failed";
                else return "Delete staff successfully";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}