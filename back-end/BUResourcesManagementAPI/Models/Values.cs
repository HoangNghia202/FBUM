using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.Models
{
    public class Values
    {
        public String Key { get; set; } 
        public String Value { get; set; }

        public Values() { }

        public Values(String key, String value)
        {
            Key = key;
            Value = value;
        }
    }
}