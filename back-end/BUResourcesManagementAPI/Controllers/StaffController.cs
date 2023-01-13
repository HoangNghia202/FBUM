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
        public HttpResponseMessage Get()
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

        [HttpGet] // api/staff/id
        public HttpResponseMessage Get(int id)
        {
            try
            {
                Staff staff = null;
                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position
                            WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID = " + id;

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
                            int staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            staff = new Staff(staffID, staffName, password, staffRole, level, mainPosition);
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return Request.CreateResponse(HttpStatusCode.NotFound, staff);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, staff);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost] // api/staff
        public HttpResponseMessage Post([FromBody] Staff staff)
        {
            try
            {
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
                    if (command.ExecuteNonQuery() != 1) return Request.CreateErrorResponse(HttpStatusCode.ExpectationFailed, "Create new staff failed");
                    else return Request.CreateResponse(HttpStatusCode.OK, "Create new staff successfully");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("api/staff/login")] // api/staff/login/{id}
        public HttpResponseMessage Login([FromBody] Staff staff)
        {
            try
            {
                int id = 1;
                Staff login = null;
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
                            login = new Staff(staffID, staffName, password, staffRole, level, mainPosition);
                        }
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.Conflict, login);
                    }
                }

                return Request.CreateResponse(HttpStatusCode.OK, login);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPut] // api/staff
        public HttpResponseMessage Put([FromBody] Staff staff)
        {
            try
            {
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
                    if (command.ExecuteNonQuery() != 1) return Request.CreateErrorResponse(HttpStatusCode.ExpectationFailed, "Update staff failed");
                    else return Request.CreateResponse(HttpStatusCode.OK, "Update staff successfully");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpDelete] // api/staff/{id}
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                String query = @"DELETE FROM Staff WHERE StaffID = @StaffID;";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.Parameters.AddWithValue("@StaffID", id);
                    if (command.ExecuteNonQuery() != 1) return Request.CreateErrorResponse(HttpStatusCode.ExpectationFailed, "Delete staff failed");
                    else return Request.CreateResponse(HttpStatusCode.OK, "Delete staff successfully");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}