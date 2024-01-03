using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Utils;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IAuthenticationService _authenticationService;


        public UsersController(MyDbContext context, UserManager<User> userManager, IAuthenticationService authenticationService)
        {
            _context = context;
            _userManager = userManager;
            _authenticationService = authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDTO request)
        {
            try
            {
                var response = await _authenticationService.Login(request);
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register([FromBody] RegisterDTO request)
        {
            try
            {
                var response = await _authenticationService.Register(request);
                return Ok(response);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // GET: api/users/me
        [HttpGet("me")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return user.ToDTO();
        }

        [HttpGet]
        [Roles(new[] { RoleNames.Admin, RoleNames.Editor })]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = users.Select(u => u.ToDTO()).ToList();

            return Ok(userDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserDTO userDto)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            if (id != userDto.Id)
            {
                return BadRequest();
            }
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            _context.Entry(user).State = EntityState.Modified;
            user.Name = userDto.Name;
            if (!string.IsNullOrEmpty(userDto.Initials))
            {
                user.Initials = userDto.Initials;
            }
            var result = await UpdateUserRoles(_userManager, user, user.Roles, userDto.Roles);
            if (!result.Succeeded)
            {
                return BadRequest(result);
            }
            user.Roles = userDto.Roles;
            result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return NoContent();
            }

            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest($"Failed to delete user: {errors}");
        }

        [HttpGet("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDTO>> GetUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            return user.ToDTO();
        }


        public static async Task<IdentityResult> UpdateUserRoles(UserManager<User> _userManager, User user, UserRoles? oldRoles, UserRoles? newRoles)
        {
            if (oldRoles != null && oldRoles.GetActiveRoles() is var currentRoles)
            {
                var result = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                // pokud uživatel nemá žádnou roli a spadne to, tak asi chceme opravit nějakou nesrovnalost
                if (!result.Succeeded && _userManager.GetRolesAsync(user).Result.Count > 1)
                {
                    return result;
                }
            }
            if (newRoles != null && newRoles.GetActiveRoles() is var rollesToAdd && rollesToAdd.Any())
            {
                var result = await _userManager.AddToRolesAsync(user, rollesToAdd);
                if (!result.Succeeded)
                {
                    return result;
                }
            }
            return IdentityResult.Success;
        }

        public static async Task SeedUsers(UserManager<User> userManager)
        {
            //TODO REMOVE
            //Check if it's already seeded
            if (userManager.FindByEmailAsync("admin@admin.cz").Result != null)
                return;


            var roles = new UserRoles() { User = true, Administrator = true };
            //Create User
            var user = new User
            {
                Email = "admin@admin.cz",
                UserName = "admin@admin.cz",
                Name = "Administrátor",
                Initials = "A",
                Roles = roles
            };

            //Set password
            await userManager.CreateAsync(user, "123");
            await UpdateUserRoles(userManager, user, new UserRoles(), roles);


        }
    }


}
