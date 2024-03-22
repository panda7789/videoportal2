// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using System.Text;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Utils
{
    public interface IMailService
    {
        Task<bool> SendMailAsync(MailData mailData);
        string GetAppUrl();
    }
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
            var codePages = CodePagesEncodingProvider.Instance;
            Encoding.RegisterProvider(codePages);
        }
        public string GetAppUrl()
        {
            return _mailSettings.AppUrl;
        }

        public async Task<bool> SendMailAsync(MailData mailData)
        {
            if (_mailSettings is null)
            {
                return false;
            }
            try
            {
                using var emailMessage = new MimeMessage();
                var emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                emailMessage.From.Add(emailFrom);
                var emailTo = new MailboxAddress(mailData.EmailToName, mailData.EmailToId);
                emailMessage.To.Add(emailTo);
                emailMessage.Subject = mailData.EmailSubject;

                var emailBodyBuilder = new BodyBuilder
                {
                    HtmlBody = mailData.EmailBody
                };

                emailMessage.Body = emailBodyBuilder.ToMessageBody();
                using var mailClient = new SmtpClient();
                await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await mailClient.AuthenticateAsync(_mailSettings.UserName, _mailSettings.Password);
                await mailClient.SendAsync(emailMessage);
                await mailClient.DisconnectAsync(true);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
    public class MailSettings
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string AppUrl { get; set; }
    }
    public class MailData
    {
        public string EmailToId { get; set; }
        public string EmailToName { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
    }
}
