﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Backend.Migrations;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserGroupsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public UserGroupsController(MyDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Vrací skupiny aktuálně přihlášeného uživatele, tedy vlastněné. Pro Administrátora jsou vráceny všechny.
        /// </summary>
        [HttpGet("my-usergroups")]
        public async Task<ActionResult<IEnumerable<UserGroupDTO>>> GetMyUserGroups()
        {
            if (_context.UserGroups == null)
            {
                return NotFound();
            }
            var user = User.GetUser(_context);
            if (user.Roles.Administrator)
            {
                return _context.UserGroups.Include(x => x.Users).Select(x => x.ToDTO()).ToList();
            }
            var ownedGroups = await GetOwnedGroups(user);
            return ownedGroups.Union(user.UserGroups).Distinct().Select(x => x.ToDTO()).ToList();
        }

        // GET: api/UserGroups/5
        /// <summary>
        /// Vrací konkrétní skupinu uživatelů
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserGroupDTO>> GetUserGroup(Guid id)
        {
            if (_context.UserGroups == null)
            {
                return NotFound();
            }
            var userGroup = await _context.UserGroups.Include(x => x.Users).Where(x => x.Id == id).FirstOrDefaultAsync();

            if (userGroup == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Skupina nenalezena");
            }

            return userGroup.ToDTO();
        }

        // PUT: api/UserGroups/5
        /// <summary>
        /// Upraví skupinu uživatelů
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserGroup(Guid id, UserGroupPostPutDTO userGroup)
        {
            var userGroupDB = await _context.UserGroups.Include(x => x.Users).Where(x => x.Id == id).FirstOrDefaultAsync();
            if (userGroupDB == null)
            {
                return NotFound();
            }
            try
            {
                ValidateDuplicates(userGroup.Name, id);
                if (userGroup.OwnerGroupId != userGroupDB.OwnerGroupId)
                {
                    var ownerGroup = await _context.UserGroups.FindAsync(userGroup.OwnerGroupId);
                    if (ownerGroup == null)
                    {
                        return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Skupina vlastníka nenalezena");
                    }
                    var actualUser = User.GetUser(_context);
                    if (!actualUser.Roles.Administrator && !actualUser.UserGroups.Any(x => x.Id == ownerGroup.Id) && !GetOwnedGroups(actualUser).Result.Contains(ownerGroup))
                    {
                        return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Uživatel není součástí skupiny vlastníka");
                    }
                    userGroupDB.OwnerGroupId = ownerGroup.Id;
                }
                userGroupDB.Name = userGroup.Name;
                if (userGroupDB.Users?.Any() ?? false)
                {
                    userGroupDB.Users.Clear();
                }
                else
                {
                    userGroupDB.Users = new List<User>();
                }
                if (userGroup.UserIds?.Any() ?? false)
                {
                    foreach (var userId in userGroup.UserIds)
                    {
                        var user = await _context.Users.FindAsync(userId);
                        if (user != null)
                        {
                            userGroupDB.Users.Add(user);
                        }
                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserGroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UserGroups
        /// <summary>
        /// Vytvoří skupinu uživatelů
        /// </summary>
        [HttpPost]
        [Roles(RoleNames.Admin, RoleNames.Editor)]
        public async Task<ActionResult<UserGroup>> PostUserGroup(UserGroupPostPutDTO userGroup)
        {
            if (_context.UserGroups == null)
            {
                return Problem();
            }

            ValidateDuplicates(userGroup.Name, null);

            var ownerGroup = await _context.UserGroups.FindAsync(userGroup.OwnerGroupId);
            if (ownerGroup == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Skupina vlastníka nenalezena");
            }
            var actualUser = User.GetUser(_context);
            if (!actualUser.Roles.Administrator && !actualUser.UserGroups.Any(x => x.Id == ownerGroup.Id) && !GetOwnedGroups(actualUser).Result.Contains(ownerGroup))
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Uživatel není součástí skupiny vlastníka");
            }
            var users = new List<User>();
            if (userGroup.UserIds?.Any() ?? false)
            {
                foreach (var userId in userGroup.UserIds)
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        users.Add(user);
                    }
                }
            }
            var newGroup = new UserGroup
            {
                Name = userGroup.Name,
                Users = users,
                OwnerGroupId = userGroup.OwnerGroupId
            };

            _context.UserGroups.Add(newGroup);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/UserGroups/5
        /// <summary>
        ///  Smaže skupinu uživatelů
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserGroup(Guid id)
        {
            if (_context.UserGroups == null)
            {
                return NotFound();
            }
            var userGroup = await _context.UserGroups.FindAsync(id);
            if (userGroup == null)
            {
                return NotFound("SKupina nenalezena");
            }

            _context.UserGroups.Remove(userGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserGroupExists(Guid id)
        {
            return (_context.UserGroups?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private async Task<List<UserGroup>> GetOwnedGroups(User user)
        {
            var userGroups = user.UserGroups.Select(x => x.Id);
            return await _context.UserGroups.Include(x => x.Users).Where(x => x.OwnerGroupId != null && userGroups.Any(y => y == (Guid)x.OwnerGroupId)).ToListAsync();
        }

        private void ValidateDuplicates(string name, Guid? id)
        {
            if (_context.UserGroups.Any(x => x.Name == name && x.Id != id))
            {
                throw new Exception("Skupina se stejnýnm názvem již existuje");
            }
        }
    }
}
