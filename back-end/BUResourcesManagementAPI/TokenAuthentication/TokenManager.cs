using BUResourcesManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Web;
using BUResourcesManagementAPI.Controllers;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Net;

namespace BUResourcesManagementAPI.TokenAuthentication
{
    public class TokenManager : ITokenManager
    {
        private JwtSecurityTokenHandler tokenHandler;
        private byte[] secretKey;

        public TokenManager()
        {
            tokenHandler = new JwtSecurityTokenHandler();
            secretKey = Encoding.ASCII.GetBytes("ford_sieu_cap_dep_trai");
        }

        public bool Authenticate(int staffID, String password)
        {
            Staff staff = new Staff(staffID, password);
            if (new StaffController().Login(staff) != null) return true;
            return false;
        }

        public String NewToken(int staffID)
        {
            Staff staff = new StaffController().Get(staffID);
            var claims = new List<Claim> {
                new Claim("StaffID", staff.StaffID.ToString()),
                new Claim("Role", staff.StaffRole)
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);

            return jwtString;
        }

        public bool VerifyToken(String token)
        {
            try
            {
                var claims = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public String GetToken()
        {
            HttpContext context = HttpContext.Current;
            if (context.Request.Headers["Authorization"] != null)
            {
                return context.Request.Headers["Authorization"].ToString();
            }
            else
            {
                return "";
            }
        }

        public Staff GetStaff()
        {
            String token;
            if (GetToken().Split(' ').Length == 2) token = GetToken().Split(' ')[1];
            else token = GetToken().Split(' ')[0];
            if (!VerifyToken(token)) return null;
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
            int staffID = int.Parse(jwt.Claims.First(c => c.Type == "StaffID").Value);
            return new StaffController().Get(staffID);
        }
    }
}