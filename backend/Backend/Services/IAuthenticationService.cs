using Backend.Models;
using NuGet.Protocol.Plugins;

namespace Backend.Services
{
    public interface IAuthenticationService
    {
        Task<string> Register(RegisterDTO request);
        Task<string> Login(LoginDTO request);
    }
}
