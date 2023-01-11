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

namespace BUResourcesManagementAPI.Controllers
{
    public class StaffController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            DataTable dataTable = new DataTable();

            String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position
                            WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID;";

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
        public HttpResponseMessage Get(int id)
        {
            DataTable dataTable = new DataTable();

            String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position
                            WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID = " + id;

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
        public String Post([FromBody] Staff staff)
        {
            try
            {
                String query = @"INSERT INTO Staff VALUES (N'"
                                + staff.StaffName + @"', '"
                                + staff.Password + @"', "
                                + staff.StaffRole + @", "
                                + staff.Level + @", "
                                + staff.MainPosition + @");";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand())
                {
                    connection.Open();
                    command.Connection = connection;
                    command.CommandText = query;
                    if (command.ExecuteNonQuery() == 1) return "Staff was added successfully";
                    else return "Error";
                }
            }
            catch (Exception ex)
            {
                return $"{ex}";
            }
        }

        [HttpPost]
        [Route("api/login")]
        public String Login([FromBody] Staff staff)
        {
            String query = @"SELECT * FROM Staff WHERE StaffID = " + staff.StaffID + " AND Password = '" + staff.Password + "';";

            using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
            using (var command = new SqlCommand())
            {
                connection.Open();
                command.Connection = connection;
                command.CommandText = query;
                var reader = command.ExecuteReader();
                if (reader.HasRows) return "Login successfully";
                else return "Incorrect ID or password";
            };
        }

        [HttpPut]
        public String Put([FromBody] Staff staff)
        {
            String query = @"UPDATE Staff SET 
                            StaffName = @StaffName, 
                            Password =  @Password,
                            StaffRole = @StaffRole,
                            Level = @Level,
                            MainPosition = @MainPosition 
                            WHERE StaffID = @StaffID;";

            using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
            using (var command = new SqlCommand())
            {
                connection.Open();
                command.Connection = connection;
                command.CommandText = query;
                command.Parameters.AddWithValue("@StaffName", staff.StaffName);
                command.Parameters.AddWithValue("@Password", staff.Password);
                command.Parameters.AddWithValue("@StaffRole", staff.StaffRole);
                command.Parameters.AddWithValue("@Level", staff.Level);
                command.Parameters.AddWithValue("@MainPosition", staff.MainPosition);
                if (command.ExecuteNonQuery() == 1) return "Update successfully";
                else return "Error";
            };
        }

        [HttpDelete]
        public String Delete(int id)
        {
            String query = @"DELETE FROM Staff WHERE StaffID = @StaffID;";

            using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
            using (var command = new SqlCommand())
            {
                connection.Open();
                command.Connection = connection;
                command.CommandText = query;
                command.Parameters.AddWithValue("@StaffID", id);
                if (command.ExecuteNonQuery() == 1) return "Delete successfully";
                else return "Error";
            };
        }
    }
}

