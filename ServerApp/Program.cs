using Microsoft.EntityFrameworkCore;
using ServerApp.Data;
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
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString(AppConstants.Settings.ConnectionStrings.SQLServerConnection));
});
// Register UnitOfWork and TaskService with dependency injection
builder.Services.AddUnitOfWork<UnitOfWork, TaskRepository>();
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
