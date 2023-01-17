using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Position
    {
        public int PositionID { get; set; }

        public String PositionName { get; set; }

        public Position() { }

        public Position(int positionID, string positionName)
        {
            PositionID = positionID;
            PositionName = positionName;
        }
    }
}