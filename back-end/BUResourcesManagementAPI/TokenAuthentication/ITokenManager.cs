using System.Security.Claims;

namespace BUResourcesManagementAPI.TokenAuthentication
{
    public interface ITokenManager
    {
        bool Authenticate(int staffID, string password);
        string NewToken(int staffID);
        bool VerifyToken(string token);
    }
}