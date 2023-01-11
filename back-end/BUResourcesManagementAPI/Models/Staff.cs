using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Staff
    {
        public int StaffID { get; set; }
        public String StaffName { get; set; }
        public String Password { get; set; }
        public int StaffRole { get; set; }
        public int Level { get; set; }
        public int MainPosition { get; set; }

        public Staff() { }

        public Staff(string staffName, string password)
        {
            StaffName = staffName;
            Password = password;
        }

        public Staff(string staffName, string password, int staffRole, int level, int mainPosition)
        {
            StaffName = staffName;
            Password = password;
            StaffRole = staffRole;
            Level = level;
            MainPosition = mainPosition;
        }

        public Staff(int staffID, string staffName, string password, int staffRole, int level, int mainPosition)
        {
            StaffID = staffID;
            StaffName = staffName;
            Password = password;
            StaffRole = staffRole;
            Level = level;
            MainPosition = mainPosition;
        }
    }
}