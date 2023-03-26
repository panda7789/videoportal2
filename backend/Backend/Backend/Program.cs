using Backend.Models;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

builder.Services.AddSwaggerGen(c =>
{
    c.SupportNonNullableReferenceTypes();
    c.SchemaFilter<MarkAsRequiredIfNonNullable>();
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
//builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequiredLength = 1;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
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
            b
                .WithOrigins("http://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(ServerVersion.AutoDetect(connectionString));
builder.Services.AddDbContext<MyDbContext>(
        dbContextOptions => dbContextOptions
            .UseMySql(connectionString, serverVersion)
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
    );

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactClient");
app.UseHttpsRedirection();
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // claim not overwriten
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
