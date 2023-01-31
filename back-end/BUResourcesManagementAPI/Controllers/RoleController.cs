using BUResourcesManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Razor.Tokenizer.Symbols;
using System.Web.Routing;

namespace BUResourcesManagementAPI.Controllers
{
    public class RoleController : ApiController
    {
        [HttpGet] // api/role
        [Route("api/role")]
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

        // GET: api/Role/5
        public string Get(int id)
        {
            return "value";
        }

        // GET: api/role/{roleName}
        [Route("api/role/{roleName}")]
        public String GetRoleIDToString(String roleName)
        {
            try
            {
                String query = @"SELECT RoleID From Role WHERE RoleName = @RoleName";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@RoleName", roleName);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            return reader.GetInt32(0).ToString();
                        }
                    }
                    connection.Close();
                }

                return "Don't have role " + roleName;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/Role
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Role/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Role/5
        public void Delete(int id)
        {
        }
    }
}
