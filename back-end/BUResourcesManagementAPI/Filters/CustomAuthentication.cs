using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using System.Net;
using System.Net.Http;
using BUResourcesManagementAPI.Models;
using BUResourcesManagementAPI.TokenAuthentication;
using System.Security.Principal;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;

namespace BUResourcesManagementAPI.Filters
{
    public class CustomAuthentication : AuthorizationFilterAttribute
    {
        private static readonly string[] _emptyArray = new string[0];

        private string _roles;

        private string[] _rolesSplit = _emptyArray;

        public string Roles
        {
            get
            {
                return _roles ?? string.Empty;
            }
            set
            {
                _roles = value;
                _rolesSplit = SplitString(value);
            }
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (SkipAuthorization(actionContext)) { return; }

            if (actionContext.Request.Headers.Authorization == null)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "You are not authenticated to access this resource");
                return;
            }

            else
            {
                String token = actionContext.Request.Headers.Authorization.Parameter;

                if (new TokenManager().VerifyToken(token))
                {
                    Staff staff = new TokenManager().GetStaff(token);
                    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(staff.StaffID.ToString()), new String[] { staff.StaffRole });
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, _roles);
                }
                else
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "You are not authenticated to access this resource");
                }
            }

            if (_rolesSplit.Length != 0 && !_rolesSplit.Any(Thread.CurrentPrincipal.IsInRole))
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "You are not authorized to access this resource");
            }

        }

        private static string[] SplitString(string original)
        {
            if (string.IsNullOrEmpty(original))
            {
                return _emptyArray;
            }

            return (from piece in original.Split(',') let trimmed = piece.Trim() where !string.IsNullOrEmpty(trimmed) select trimmed).ToArray();
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            if (!actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any())
            {
                return actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
            }

            if (actionContext.Request.Headers.Authorization == null) return false;
            else return true;
        }

        public CustomAuthentication()
        {
        }
    }
}