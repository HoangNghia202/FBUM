using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Staff
    {
        public int StaffID { get; set; }
        public String StaffName { get; set; }
        public String Password { get; set; }
        public String StaffRole { get; set; }
        public int Level { get; set; }
        public String MainPosition { get; set; }

        public Staff() { }

        public Staff(int staffID, String password)
        {
            StaffID = staffID;
            Password = password;
        }

        public Staff(String staffName, String password, String staffRole, int level, String mainPosition)
        {
            StaffName = staffName;
            Password = password;
            StaffRole = staffRole;
            Level = level;
            MainPosition = mainPosition;
        }

        public Staff(int staffID, String staffName, String password, String staffRole, int level, String mainPosition)
        {
            StaffID = staffID;
            StaffName = staffName;
            Password = password;
            StaffRole = staffRole;
            Level = level;
            MainPosition = mainPosition;
        }

        public bool CheckValidStaff()
        {
            if (StaffName == null || StaffName.Length == 0) return false;
            if (Password == null || Password.Length == 0) return false;
            try
            {
                int.Parse(StaffRole);
                int.Parse(MainPosition);
            }
            catch
            {
                return false;
            }
            return true;
        }
    }
}