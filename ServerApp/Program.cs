using Microsoft.EntityFrameworkCore;
using ServerApp.Data;
using ServerApp.MongoDbTaskRepository;
using ServerApp.MongoDbTaskRepository.Data;
using ServerApp.MongoDbTaskRepository.Options;
using ServerApp.Shared;
using ServerApp.TaskRepository;
using ServerApp.TaskService;
using ServerApp.TaskService.Extensions;
using ServerApp.UnitOfWork;
using ServerApp.UnitOfWork.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "ServerApp API",
        Description = "API for managing tasks in the Kanban board application"
    });
});
var dbProvider = builder.Configuration.GetValue<string>(AppConstants.Settings.DBProvider)?.ToLower();
if (string.Equals(dbProvider, "sqlserver", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString(AppConstants.Settings.ConnectionStrings.SQLServerConnection));
    });
    // Register UnitOfWork and TaskService with dependency injection
    builder.Services.AddUnitOfWork<UnitOfWork<AppDbContext>, TaskRepository>();
}
else if (string.Equals(dbProvider, "mongodb", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddDbContext<MongoDBApplicationDbContext>(options =>
    {
        MongoDbOptions mongoDbOptions = builder.Configuration.GetSection("MongoDbOptions").Get<MongoDbOptions>() ?? throw new InvalidOperationException("Failed to bind MongoDB options from configuration.");
        options.UseMongoDB(mongoDbOptions.ConnectionString, mongoDbOptions.DatabaseName);
        // Register UnitOfWork and TaskService with dependency injection
    });
    builder.Services.AddUnitOfWork<UnitOfWork<MongoDBApplicationDbContext>, MongoDBTaskRepository>();
}
else
{
    var validProviders = string.Join(" or ", new AppConstants.Settings().ValidDbProviders);
    throw new InvalidOperationException($"Invalid database provider specified in configuration. Please set 'DBProvider' to either {validProviders} in appsettings.json.");
}
builder.Services.AddTaskService<TaskService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Update this to match your frontend URL and port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString(AppConstants.Settings.ConnectionStrings.RedisConnection);
    options.InstanceName = "TodoListApp_"; // Optional: Prefix for Redis keys to avoid collisions
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ServerApp API V1");
        options.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
