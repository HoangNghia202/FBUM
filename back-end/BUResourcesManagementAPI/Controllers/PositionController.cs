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

namespace BUResourcesManagementAPI.Controllers
{
    public class PositionController : ApiController
    {
        [HttpGet] // api/position
        [Route("api/position")]
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
