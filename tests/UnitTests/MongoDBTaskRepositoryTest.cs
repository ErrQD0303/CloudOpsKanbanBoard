using Microsoft.Extensions.Configuration;
using ServerApp.MongoDbTaskRepository;
using ServerApp.MongoDbTaskRepository.Data;
using ServerApp.TaskRepository;
using Microsoft.EntityFrameworkCore;
using Xunit;
using ServerApp.MongoDbTaskRepository.Options;
using Microsoft.Extensions.Logging;

namespace UnitTests;

public class MongoDBTaskRepositoryTest : IAsyncLifetime
{
    private readonly IConfiguration _configuration;
    private readonly ITaskRepository _taskRepository;
    private readonly MongoDBApplicationDbContext _dbContext;

    public MongoDBTaskRepositoryTest()
    {
        _configuration = new ConfigurationBuilder()
            .AddJsonFile($"appsettings.Test.json", optional: false)
            .AddUserSecrets<MongoDBTaskRepositoryTest>() // Ensure this is added to access secrets
            .Build();

        var mongoDbOptions = _configuration.GetSection("MongoDbOptions").Get<MongoDbOptions>() ?? throw new InvalidOperationException("Failed to bind MongoDB options from configuration.");

        var options = new DbContextOptionsBuilder<MongoDBApplicationDbContext>()
            .UseMongoDB(mongoDbOptions.ConnectionString, mongoDbOptions.DatabaseName)
            .Options;

        var logger = new LoggerFactory().CreateLogger<MongoDBTaskRepository>();

        _dbContext = new MongoDBApplicationDbContext(options);

        _taskRepository = new MongoDBTaskRepository(
            _dbContext,
            logger
        );
    }

    [Fact]
    public async Task GetAllTasksAsync_ShouldReturnAllTasks()
    {
        // Arrange
        // (You can add some tasks to the repository here if needed)

        // Act
        var tasks = await _taskRepository.GetAllTasksAsync();

        // Assert
        Assert.NotNull(tasks);
        // You can add more assertions here based on your expected results
    }

    [Fact]
    public async Task GetTasksByIdAsync_ShouldReturnCorrectTask()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task for GetById",
            Description = "This is a test task to ensure GetById works",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        await _taskRepository.AddTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Act
        var retrievedTask = await _taskRepository.GetTaskByIdAsync(newTask.Id);

        // Assert
        Assert.NotNull(retrievedTask);
        Assert.Equal(newTask.Title, retrievedTask?.Title);
        Assert.Equal(newTask.Description, retrievedTask?.Description);
        Assert.Equal(newTask.Status, retrievedTask?.Status);
    }

    [Fact]
    public async Task GetTasksByStatusAsync_ShouldReturnTasksWithCorrectStatus()
    {
        // Arrange
        List<ServerApp.Models.Task> tasksToAdd = new List<ServerApp.Models.Task>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Title = "Test Task 1 for GetByStatus",
                Description = "This is a test task to ensure GetByStatus works - Task 1",
                Status = ServerApp.Models.TaskStatus.IN_PROGRESS
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Title = "Test Task 2 for GetByStatus",
                Description = "This is a test task to ensure GetByStatus works - Task 2",
                Status = ServerApp.Models.TaskStatus.IN_PROGRESS
            },
            new() {
                Id = Guid.NewGuid().ToString(),
                Title = "Test Task 3 for GetByStatus",
                Description = "This is a test task to ensure GetByStatus works - Task 3",
                Status = ServerApp.Models.TaskStatus.TODO
            }
        };

        foreach (var task in tasksToAdd)
        {
            await _taskRepository.AddTaskAsync(task);
        }
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Act
        var tasksInProgress = await _taskRepository.GetTasksByStatusAsync(ServerApp.Models.TaskStatus.IN_PROGRESS);

        // Assert
        Assert.NotNull(tasksInProgress);
        Assert.All(tasksInProgress, t => Assert.Equal(ServerApp.Models.TaskStatus.IN_PROGRESS, t.Status));
        Assert.Contains(tasksInProgress, t => t.Title == "Test Task 1 for GetByStatus");
        Assert.Contains(tasksInProgress, t => t.Title == "Test Task 2 for GetByStatus");
        Assert.DoesNotContain(tasksInProgress, t => t.Title == "Test Task 3 for GetByStatus");
        Assert.Equal(2, tasksInProgress.Count());
    }

    [Fact]
    public async Task GetAllTasksAsync_ShouldNotReturnEmptyList()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task for GetAllTasksAsync",
            Description = "This is a test task to ensure GetAllTasksAsync does not return an empty list",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        // Act
        await _taskRepository.AddTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Assert
        var tasks = await _taskRepository.GetAllTasksAsync();
        Assert.NotNull(tasks);
        Assert.NotEmpty(tasks);
    }

    [Fact]
    public async Task AddNewTask_ShouldAddTaskSuccessfully()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task",
            Description = "This is a test task",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        // Act
        await _taskRepository.AddTaskAsync(newTask);

        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        var retrievedTask = await _taskRepository.GetTaskByIdAsync(newTask.Id);

        // Assert
        Assert.NotNull(retrievedTask);
        Assert.Equal(newTask.Title, retrievedTask?.Title);
        Assert.Equal(newTask.Description, retrievedTask?.Description);
        Assert.Equal(newTask.Status, retrievedTask?.Status);
    }

    [Fact]
    public async Task UpdateTaskStatus_ShouldUpdateStatusSuccessfully()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task for Update",
            Description = "This is a test task to ensure status update works",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        await _taskRepository.AddTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Act
        newTask.Status = ServerApp.Models.TaskStatus.IN_PROGRESS;
        await _taskRepository.UpdateTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        var updatedTask = await _taskRepository.GetTaskByIdAsync(newTask.Id);

        // Assert
        Assert.NotNull(updatedTask);
        Assert.Equal(ServerApp.Models.TaskStatus.IN_PROGRESS, updatedTask?.Status);
    }

    [Fact]
    public async Task UpdateTaskProperties_ShouldUpdateSuccessfully()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task for Update",
            Description = "This is a test task to ensure status update works",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        await _taskRepository.AddTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Act
        newTask.Status = ServerApp.Models.TaskStatus.DONE;
        newTask.Title = "Updated Task Title";
        newTask.Description = "Updated Task Description";
        await _taskRepository.UpdateTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        var updatedTask = await _taskRepository.GetTaskByIdAsync(newTask.Id);

        // Assert
        Assert.NotNull(updatedTask);
        Assert.Equal(ServerApp.Models.TaskStatus.DONE, updatedTask?.Status);
        Assert.Equal("Updated Task Title", updatedTask?.Title);
        Assert.Equal("Updated Task Description", updatedTask?.Description);
    }

    [Fact]
    public async Task DeleteTask_ShouldDeleteSuccessfully()
    {
        // Arrange
        var newTask = new ServerApp.Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test Task for Deletion",
            Description = "This is a test task to ensure deletion works",
            Status = ServerApp.Models.TaskStatus.TODO
        };

        await _taskRepository.AddTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        // Act
        await _taskRepository.DeleteTaskAsync(newTask);
        await _dbContext.SaveChangesAsync(); // Ensure changes are saved to the database

        var deletedTask = await _taskRepository.GetTaskByIdAsync(newTask.Id);

        // Assert
        Assert.Null(deletedTask);
    }


    public Task InitializeAsync()
    {
        return Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        // Clean up any test data if necessary
        await _dbContext.Database.EnsureDeletedAsync();
    }
}
