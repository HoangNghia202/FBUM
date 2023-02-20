using BUResourcesManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Web.Http;

namespace BUResourcesManagementAPI.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        [HttpGet]
        [Filters.CustomAuthentication(Roles = "Admin")]
        //[Authorize(Roles = "Admin")]
        public String Get()
        {
            if (Thread.CurrentPrincipal.IsInRole("PM")) return "OK";
            else return "Not OK";
        }

        // GET api/values/5
        [HttpGet]
        [Filters.CustomAuthentication]
        [AllowAnonymous]
        public String Get(int id)
        {
            if (Thread.CurrentPrincipal.IsInRole("PM")) return "OK";
            else return "Not OK";
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
