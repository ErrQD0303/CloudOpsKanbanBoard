using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using ServerApp.Models.Requests;
using ServerApp.Shared;
using ServerApp.TaskService;
using StackExchange.Redis;

namespace ServerApp.Controllers;

[ApiController]
[Route("tasks")]
public class TaskController : ControllerBase
{
    private readonly ILogger<TaskController> _logger;
    private readonly ITaskService _taskService;
    private readonly IDistributedCache _cache;

    public TaskController(ILogger<TaskController> logger, ITaskService taskService, IDistributedCache cache)
    {
        _logger = logger;
        _taskService = taskService;
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken = default)
    {
        var tasks = await _taskService.GetAllTasksAsync();

        return Ok(tasks.Select(t => t.MapToFrontendTaskModel()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id, CancellationToken cancellationToken = default)
    {
        var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
        if (task == null)
        {
            return NotFound($"Task with ID {id} not found.");
        }

        return Ok(task.MapToFrontendTaskModel());
    }

    [HttpPost]
    public async Task<IActionResult> AddTask(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            byte[] requestBytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(request);
            var key = $"{nameof(CreateTaskRequest)}:{request.Title}:{new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds()}";
            _cache.Set(key, requestBytes, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10), // Cache for 10 minutes
                SlidingExpiration = TimeSpan.FromMinutes(5) // Reset expiration if accessed within 5 minutes
                // It means the maximum life time of a cache entry is 10 minutes, but if it is not accessed for 5 minutes, it will be removed from the cache. This helps to keep the cache clean and relevant.
            });
            _logger.LogInformation("Cached CreateTaskRequest for task with title {TaskTitle} under key {CacheKey}", request.Title, key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error caching CreateTaskRequest for task with title {TaskTitle}", request.Title);
            // No return here, just for demo of caching
        }

        try
        {
            var newTask = await _taskService.AddTaskAsync(request, cancellationToken);
            return CreatedAtAction(nameof(Get), new { id = newTask?.Id }, newTask?.MapToFrontendTaskModel());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding task with title {TaskTitle}", request.Title);

            return StatusCode(500, "An error occurred while adding the task. Please try again later.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(string id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _taskService.DeleteTaskAsync(id, cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task with ID {TaskId}", id);

            return StatusCode(500, "An error occurred while deleting the task. Please try again later.");
        }
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateTaskStatus(string id, UpdateTaskStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (id != request.Id)
        {
            return BadRequest("Task ID in the URL does not match the ID in the request body.");
        }

        try
        {
            var updatedTask = await _taskService.UpdateTaskStatusAsync(request, cancellationToken);
            if (updatedTask == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            return Ok(updatedTask.MapToFrontendTaskModel());
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Concurrency conflict detected for task with ID {TaskId}", id);
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument provided for task with ID {TaskId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status for task with ID {TaskId}", id);

            return StatusCode(500, "An error occurred while updating the task status. Please try again later.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(string id, UpdateTaskRequest request, CancellationToken cancellationToken = default)
    {
        if (id != request.Id)
        {
            return BadRequest("Task ID in the URL does not match the ID in the request body.");
        }

        try
        {
            var updatedTask = await _taskService.UpdateTaskAsync(request, cancellationToken);
            if (updatedTask == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            return Ok(updatedTask.MapToFrontendTaskModel());
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Concurrency conflict detected for task with ID {TaskId}", id);
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument provided for task with ID {TaskId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task with ID {TaskId}", id);

            return StatusCode(500, "An error occurred while updating the task. Please try again later.");
        }
    }
}
