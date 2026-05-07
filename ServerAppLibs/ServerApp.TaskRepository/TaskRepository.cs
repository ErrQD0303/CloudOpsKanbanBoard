using Microsoft.Extensions.Logging;
using ServerApp.Data;

namespace ServerApp.TaskRepository;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<TaskRepository> _logger;

    public TaskRepository(AppDbContext context, ILogger<TaskRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task AddTaskAsync(Models.Task task, CancellationToken cancellationToken = default)
    {
        await _context.Tasks.AddAsync(task, cancellationToken);
    }

    public Task DeleteTaskAsync(Models.Task task, CancellationToken cancellationToken = default)
    {
        // The task finding logic is moved to the service layer to ensure that the task exists before attempting deletion
        _context.Tasks.Remove(task);
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Models.Task>> GetTasksByStatusAsync(Models.TaskStatus status)
    {
        return GetTasksByConditionAsync(t => t.Status == status);
    }

    public Task<IEnumerable<Models.Task>> GetAllTasksAsync()
    {
        return Task.FromResult(_context.Tasks.AsEnumerable());
    }

    private Task<IEnumerable<Models.Task>> GetTasksByConditionAsync(Func<Models.Task, bool>? predicate = null)
    {
        IEnumerable<Models.Task> tasks = _context.Tasks.AsEnumerable();

        if (predicate != null)
        {
            tasks = tasks.Where(predicate);
        }

        return Task.FromResult(tasks);
    }

    public async Task<Models.Task?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks.FindAsync([id], cancellationToken);
    }

    public Task UpdateTaskAsync(Models.Task task)
    {
        _context.Tasks.Update(task);
        return Task.CompletedTask;
    }
}
