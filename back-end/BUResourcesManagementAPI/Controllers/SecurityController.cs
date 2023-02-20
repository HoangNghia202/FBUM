using BUResourcesManagementAPI.Models;
using BUResourcesManagementAPI.TokenAuthentication;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BUResourcesManagementAPI.Controllers
{
    public class SecurityController : ApiController
    {
        // GET: api/Security
        public Staff Get()
        {
            TokenManager tokenManager = new TokenManager();
            return tokenManager.GetStaff();
        }

        // GET: api/Security/5
        public String Get(int id)
        {
            TokenManager tokenManager = new TokenManager();
            return tokenManager.NewToken(id);
        }

        // POST: api/Security/Authentication
        [HttpPost]
        [Route("api/Security/Authentication")]
        [AllowAnonymous]
        public Staff Authentication([FromBody] Staff staff)
        {
            if (new TokenManager().Authenticate(staff.StaffID, staff.Password))
            {
                Staff authenStaff = new StaffController().Get(staff.StaffID);
                return new Staff(authenStaff.StaffID, authenStaff.StaffName, authenStaff.StaffRole, authenStaff.Level, authenStaff.MainPosition, new TokenManager().NewToken(staff.StaffID));
            }
            return null;
        }

        // POST: api/Security/Authorization
        [HttpPost]
        [Route("api/Security/Authorization")]
        public bool Authorization(List<String> roles)
        {
            TokenManager tokenManager = new TokenManager();
            Staff staff = tokenManager.GetStaff();
            if (staff == null) return false;
            for (int i = 0; i < roles.Count; i++)
            {
                if (staff.StaffRole.Equals(roles[i])) return true;
            }
            return false;
        }

        // PUT: api/Security/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Security/5
        public void Delete(int id)
        {
        }
    }
}
