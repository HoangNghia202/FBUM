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

namespace BUResourcesManagementAPI.TokenAuthentication
{
    public class TokenManager : ITokenManager
    {
        private JwtSecurityTokenHandler tokenHandler;
        private byte[] secretKey;

        public TokenManager()
        {
            tokenHandler = new JwtSecurityTokenHandler();
            secretKey = Encoding.ASCII.GetBytes("kkkkkkkkkkkkkkkkkkkkkkkk");
        }

        public bool Authenticate(int staffID, String password)
        {
            Staff staff = new Staff(staffID, password);
            if (new StaffController().Login(staff) != null) return true;
            return false;
        }

        public String NewToken()
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, "") }),
                Expires = DateTime.UtcNow.AddMinutes(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);
            return jwtString;
        }
    }
}