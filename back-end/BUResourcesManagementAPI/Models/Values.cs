using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Values
    {
        public String Value { get; set; }

        public Values() { }

        public Values(String value)
        {
            Value = value;
        }
    }
}