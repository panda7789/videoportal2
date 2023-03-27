using Backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Utils
{
    public static class SaveFile
    {
        public static string VideosPath = Path.Combine(@"C:\temp", "videoPortal", "videos");
        public static string ThumbnailsPath = Path.Combine(@"C:\temp", "videoPortal", "thumbnails");
        public static string ImagePath = Path.Combine(@"C:\temp", "videoPortal", "images");

        public enum FileType {
            Video,
            Thumbnail,
            Image
        }

        public static async Task<string> SaveFileAsync(FileType filetype, string fileName, IFormFile file)
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
                case FileType.Image:
                    path = Path.Combine(ImagePath, fileName);
                    break;
            }
            Directory.CreateDirectory(VideosPath);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return path;
        }
    }
}
