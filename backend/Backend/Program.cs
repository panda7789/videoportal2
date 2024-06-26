﻿using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
if (builder.Configuration.GetSection("MailSettings") is var mailConfig && mailConfig != null)
{
    builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
}
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddTransient<IMailService, MailService>();

builder.Services.AddSwaggerGen(c =>
{
    c.MapType<TimeSpan>(() => new OpenApiSchema { Type = "string", Format = "time-span" });
    c.UseAllOfToExtendReferenceSchemas();
    c.CustomSchemaIds(x => x.FullName);
    c.SupportNonNullableReferenceTypes();
    c.SchemaFilter<MarkAsRequiredIfNonNullable>();
    c.OperationFilter<SwaggerOptionalFormDataFilter>();
    c.SchemaFilter<DescriptionSchemaFilter>();
    c.CustomSchemaIds(i => i.FriendlyId());
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});

builder.Services.AddIdentity<User, Role>(options =>
{
    options.Password.RequiredLength = 1;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<MyDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secret123ASQWEWQEWQEASDQWEQEQJGWJVIEWIRJAFNEWAR"))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactClient",
        b =>
        {
            b.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(ServerVersion.AutoDetect(connectionString));
builder.Services.AddDbContext<MyDbContext>(
dbContextOptions => dbContextOptions
            .UseMySql(connectionString, serverVersion, o => o.EnableRetryOnFailure())
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
    );

var fsBasePath = builder?.Configuration["FSBasePath"] ?? null;
var fsUrl = builder?.Configuration["FSUrl"] ?? null;
SaveFile.Init(fsBasePath, fsUrl);
var apiPrefix = builder?.Configuration["ApiPrefix"] ?? null;

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MyDbContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
    await UsersController.SeedUsers(userManager);
}
app.UseSwagger(c =>
{
    c.RouteTemplate = $"{(!string.IsNullOrEmpty(apiPrefix) ? $"{apiPrefix}/" : "")}swagger/{{documentName}}/swagger.json";
});
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint($"{(!string.IsNullOrEmpty(apiPrefix) ? $"/{apiPrefix}" : "")}/swagger/v1/swagger.json", "API");
    c.RoutePrefix = $"{(!string.IsNullOrEmpty(apiPrefix) ? $"{apiPrefix}/" : "")}swagger";
});
app.UseCors("AllowReactClient");
//app.UseHttpsRedirection(); // měl by zajišťovat server
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // claim not overwriten
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
