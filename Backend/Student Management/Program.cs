using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Student_Management.Data;
using Student_Management.Repository;
using StudentManagementAPI.Repository;
using StudentManagementAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IStudentService, StudentService>();

builder.Services.AddEndpointsApiExplorer();

// Add CORS policy named "AllowAll"
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Swagger to show the Authorize (Bearer) button
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Student Management API", Version = "v1" });

    var bearerScheme = new OpenApiSecurityScheme
    {
        Description = "Enter JWT token as: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", bearerScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { bearerScheme, new List<string>() }
    });
});

// Read JWT key from configuration and validate length
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT configuration 'Jwt:Key' is missing. Add it to appsettings or a secret store.");
}

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// Ensure key is greater than 256 bits for HMAC-SHA256
if (keyBytes.Length * 8 <= 256)
{
    throw new InvalidOperationException("The configured JWT key is too short. Use a secret at least 33 bytes long (greater than 256 bits).");
}

var signingKey = new SymmetricSecurityKey(keyBytes)
{
    // Optional: set a stable KeyId if you want a 'kid' in the token header when you create tokens
    KeyId = "local-symmetric-key"
};

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey
    };
});

builder.Services.AddAuthorization();

// Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// Use CORS middleware with the "AllowAll" policy (added as requested)
app.UseCors("AllowAll");

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Student Management API v1");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();