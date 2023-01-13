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

        public Staff(String staffName, String password)
        {
            StaffName = staffName;
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

        public Staff GetStaff(int staffID)
        {
            try
            {
                Staff staff = null;
                String query = @"SELECT StaffID, StaffName, Password, RoleName AS StaffRole, Level, PositionName AS MainPosition 
                            FROM Staff, Role, Position
                            WHERE Staff.StaffRole = Role.RoleID AND Staff.MainPosition = Position.PositionID AND StaffID = " + StaffID;

                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["BUResourcesManagement"].ConnectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            staffID = reader.GetInt32(0);
                            String staffName = reader.GetString(1);
                            String password = reader.GetString(2);
                            String staffRole = reader.GetString(3);
                            int level = reader.GetInt32(4);
                            String mainPosition = reader.GetString(5);
                            staff = new Staff(staffID, staffName, password, staffRole, level, mainPosition);
                        }
                        connection.Close();
                    }
                    else
                    {
                        connection.Close();
                        return null;
                    }
                }

                return staff;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}