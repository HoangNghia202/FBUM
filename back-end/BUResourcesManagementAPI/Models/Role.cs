using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Role
    {
        public int RoleID { get; set; }

        public String RoleName { get; set; }

        public Role() { }

        public Role(int roleID, string roleName)
        {
            RoleID = roleID;
            RoleName = roleName;
        }
    }
}