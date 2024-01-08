// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using Backend.Models;

namespace Backend.Controllers
{
    public class PermissionsController
    {
        public static void SavePermissions(MyDbContext context, ObjectPermissions? permissions, Video? video = null, Playlist? playlist = null)
        {
            if (permissions == null)
            {
                return;
            }
            if (permissions.UserIds?.Any() ?? false)
            {
                foreach (var userId in permissions.UserIds)
                {
                    var user = context.Users.Single(x => x.Id == userId);
                    var permission = new Permission()
                    {
                        User = user,
                        Video = video ?? null,
                        Playlist = playlist ?? null
                    };
                    context.Permissions.Add(permission);
                }
            }
            if (permissions.GroupIds?.Any() ?? false)
            {
                foreach (var groupId in permissions.GroupIds)
                {
                    var group = context.UserGroups.Single(x => x.Id == groupId);
                    var permission = new Permission()
                    {
                        Video = video ?? null,
                        Playlist = playlist ?? null,
                        UserGroup = group
                    };
                    context.Permissions.Add(permission);
                }
            }
        }
        public static void ClearExistingPermissions(MyDbContext _context, Video? video = null, Playlist? playlist = null)
        {
            List<Permission> permissions;
            if (playlist != null)
            {
                permissions = _context.Permissions.Where(x => x.PlaylistId == playlist.Id).ToList();
                if (permissions.Any())
                {
                    _context.Permissions.RemoveRange(permissions);
                }
                return;
            }
            if (video == null)
            {
                throw new ArgumentException("Either video or playlist must be provided");
            }
            permissions = _context.Permissions.Where(x => x.VideoId == video.Id).ToList();
            if (permissions.Any())
            {
                _context.Permissions.RemoveRange(permissions);
            }
        }

    }
}
