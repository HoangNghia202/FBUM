using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BUResourcesManagementAPI.TokenAuthentication
{
    public class Token
    {
        public string Value { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}