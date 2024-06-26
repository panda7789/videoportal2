﻿using System;
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
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;
using System.Web;

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
        private readonly IMailService _mailService;


        public UsersController(MyDbContext context, UserManager<User> userManager, IAuthenticationService authenticationService, IMailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _authenticationService = authenticationService;
            _mailService = emailService;
        }

        /// <summary>
        /// Přihlásí uživatele
        /// </summary>
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
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: e.Message);
            }
        }

        /// <summary>
        /// Registruje uživatele
        /// </summary>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register([FromBody] RegisterDTO request)
        {
            try
            {
                ValidateDuplicates(request.Email, null);
                var response = await _authenticationService.Register(request);
                return Ok(response);

            }
            catch (Exception e)
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: e.Message);
            }
        }

        // GET: api/users/me
        /// <summary>
        /// Vrátí aktuálně přihlášeného uživatele
        /// </summary>
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
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Uživatel nenalezen");
            }

            return user.ToDTO();
        }

        /// <summary>
        /// Vrací seznam uživatelů (pouze pro uživatele s rolí Admin nebo Editor)
        /// </summary>
        [HttpGet]
        [Roles(new[] { RoleNames.Admin, RoleNames.Editor })]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = users.Select(u => u.ToDTO()).ToList();

            return Ok(userDtos);
        }

        /// <summary>
        /// Aktualizuje uživatele
        /// </summary>
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
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Uživatel nenalezen");
            }
            ValidateDuplicates(userDto.Email, id);

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
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: result.Errors.FirstOrDefault()?.Description);
            }

            return NoContent();
        }

        /// <summary>
        ///  Smaže uživatele (pouze pro uživatele s rolí Admin)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Uživatel nenalezen");
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return NoContent();
            }

            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Nepovedlo se smazat uživatele: {errors}");
        }

        /// <summary>
        /// Vrací konkrétního uživatele (pouze pro uživatele s rolí Admin)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDTO>> GetUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Uživatel nenalezen");
            }

            return user.ToDTO();
        }

        /// <summary>
        /// Zažádá o reset hesla. Na email přijde odkaz s tokenem pro změnu hesla. Lze poslat bez přihlášení.
        /// </summary>
        /// <param name="email">Email uživatele</param>
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return Ok();
            }

            string token = HttpUtility.UrlEncode(await _userManager.GeneratePasswordResetTokenAsync(user));
            Console.WriteLine("TOKEN: " + token);
            await _mailService.SendMailAsync(new MailData
            {
                EmailToId = email,
                EmailToName = user.Name,
                EmailSubject = "VideoPortál - Reset hesla",
                EmailBody = $"Byla vyžádána změna hesla pro Váš účet, pro změnu prosím použijte odkaz:<br />{_mailService.GetAppUrl()}/password-reset?token={token}"
            });
            return Ok();
        }

        /// <summary>
        /// Potvrdí reset hesla dle odkazu v emailu. Lze poslat bez přihlášení.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("submit-reset-password")]
        public async Task<ActionResult> SubmitPasswordReset([FromBody] PasswordResetDTO passwordReset)
        {
            var user = await _userManager.FindByEmailAsync(passwordReset.Email);
            if (user == null)
            {
                return Problem();
            }
            var result = await _userManager.ResetPasswordAsync(user, passwordReset.Token, passwordReset.Password);
            if (!result.Succeeded)
            {
                return Problem();
            }
            return Ok();
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

        private void ValidateDuplicates(string email, Guid? id)
        {
            if (_context.Users.Any(x => x.Email == email && x.Id != id))
            {
                throw new Exception("Uživatel se stejným emailem již existuje");
            }
        }
    }


}
