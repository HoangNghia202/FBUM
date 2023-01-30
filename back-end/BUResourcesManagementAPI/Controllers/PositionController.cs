using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BUResourcesManagementAPI.Controllers
{
    public class PositionController : ApiController
    {
        // GET: api/Position
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Position/5
        public string Get(int id)
        {
            return "value";
        }

        // GET: api/position/{positionName}
        [Route("api/position/{positionName}")]
        public String GetPositionIDToString(String positionName)
        {
            try
            {
                String query = @"SELECT PositionID From Position WHERE PositionName = @PositionName";

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@PositionName", positionName);
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

                return "Don't have role " + positionName;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/Position
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Position/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Position/5
        public void Delete(int id)
        {
        }
    }
}
