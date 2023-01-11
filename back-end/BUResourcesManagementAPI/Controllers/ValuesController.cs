using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BUResourcesManagementAPI.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        [HttpGet]
        public HttpResponseMessage Get()
        {
            DataTable data = new DataTable();

            data.Columns.Add("DepID");
            data.Columns.Add("DepName");

            data.Rows.Add(1, "IT");
            data.Rows.Add(2, "Support");

            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        // GET api/values/5
        [HttpGet]
        public HttpResponseMessage Get(int id)
        {
            DataTable data = new DataTable();

            data.Columns.Add("DepID");
            data.Columns.Add("DepName");

            data.Rows.Add(1, "IT");
            data.Rows.Add(2, "Support");
            data.Rows.Add(3, "ID");

            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        // POST api/values
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
