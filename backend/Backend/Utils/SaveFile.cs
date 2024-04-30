using Backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.IO;

namespace Backend.Utils
{
    public static class SaveFile
    {
        public static string PathBase = Path.Combine(Directory.GetCurrentDirectory(), "storage");
        public static string VideosPath = "videos";
        public static string ThumbnailsPath = "thumbnails";
        public static string FSUrl = "";

        public static string FileAttributeUrl(string? attr)
        {
            return !string.IsNullOrEmpty(attr) ? FSUrl + "/" + attr : null;
        }
        public enum FileType
        {
            Video,
            Thumbnail
        }

        public static void Init(string pathBaseFolder = null, string fsUrl = null)
        {
            if (pathBaseFolder != null)
            {
                PathBase = pathBaseFolder;
            }
            if (fsUrl != null)
            {
                FSUrl = fsUrl;
            }
            Directory.CreateDirectory(PathBase);
            Directory.CreateDirectory(Path.Combine(PathBase, VideosPath));
            Directory.CreateDirectory(Path.Combine(PathBase, ThumbnailsPath));
        }

        public static async Task<string> SaveFileAsync(FileType filetype, string fileName, IFormFile? file, bool chunks=false)
        {
            var guid = Guid.NewGuid();
            fileName = fileName.Replace("[GUID]", guid.ToString());
            string path = "";
            switch (filetype)
            {
                case FileType.Video:
                    path = Path.Combine(VideosPath, fileName);
                    break;
                case FileType.Thumbnail:
                    path = Path.Combine(ThumbnailsPath, fileName);
                    break;
            }
            using (var stream = new FileStream(Path.Combine(PathBase, path), chunks ? FileMode.Append : FileMode.Create))
            {
                if (file != null)
                {
                    await file.CopyToAsync(stream);
                }
            }
            return path;
        }

        public static void DeleteFile(string filePath)
        {
            var path = Path.Combine(PathBase, filePath.Replace('\\','/'));
            if (File.Exists(path))
            { 
                File.Delete(path);
            }
            else
            {
                Console.WriteLine("Cannot delete file on path: " + path);
            }
        }
                                               
    }
}
