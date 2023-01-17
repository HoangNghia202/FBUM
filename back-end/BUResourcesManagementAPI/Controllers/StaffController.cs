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

namespace BUResourcesManagementAPI.Controllers
{
    public class StaffController : ApiController
    {
        [HttpGet] // api/staff
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

        [HttpGet] // api/staff/role
        [Route("api/staff/role")]
        public List<Role> GetRole()
        {
            try
            {
                List<Role> roles = null;

                String query = @"SELECT * FROM Role";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        roles = new List<Role>();
                        while (reader.Read())
                        {
                            int roleID = reader.GetInt32(0);
                            String roleName = reader.GetString(1);
                            roles.Add(new Role(roleID, roleName));
                        }
                    }
                    connection.Close();
                }

                return roles;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/staff/position
        [Route("api/staff/position")]
        public List<Position> GetPosition()
        {
            try
            {
                List<Position> positions = null;

                String query = @"SELECT * FROM Position";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        positions = new List<Position>();
                        while (reader.Read())
                        {
                            int positionID = reader.GetInt32(0);
                            String positionName = reader.GetString(1);
                            positions.Add(new Position(positionID, positionName));
                        }
                    }
                    connection.Close();
                }

                return positions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet] // api/staff/search/{keyword}
        [Route("api/staff/search/{keyword}")]
        public List<Staff> Search(String keyword)
        {
            try
            {
                List<Staff> listStaff = null;

                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position
                                WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffName LIKE @Keyword";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@Keyword", "%" + keyword + "%");
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

        [HttpPost] // api/staff
        public String Post([FromBody] Staff staff)
        {
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
        [Route("api/staff/login/{id}")] // api/staff/login/{id}
        public Staff Login(int id, [FromBody] Staff staff)
        {
            try
            {
                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                                FROM Staff, Role, Position  
                                WHERE 
                                Staff.StaffRole = Role.RoleID AND 
                                Staff.MainPosition = Position.PositionID AND
                                StaffID = @StaffID AND 
                                Password = @Password AND 
                                StaffRole = @StaffRole;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffID", staff.StaffID);
                    command.Parameters.AddWithValue("@Password", staff.Password);
                    command.Parameters.AddWithValue("@StaffRole", id);
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

        [HttpPut] // api/staff
        public String Put([FromBody] Staff staff)
        {
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

        [HttpDelete] // api/staff/{id}
        public String Delete(int id)
        {
            try
            {
                String query = @"DELETE FROM Staff WHERE StaffID = @StaffID;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffID", id);
                    if (command.ExecuteNonQuery() != 1) return "Delete staff failed";
                    else return "Delete staff successfully";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}