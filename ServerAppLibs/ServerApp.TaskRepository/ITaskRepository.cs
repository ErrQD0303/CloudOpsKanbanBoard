using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ServerApp.TaskRepository;

public interface ITaskRepository
{
    Task<IEnumerable<Models.Task>> GetAllTasksAsync();
    Task<IEnumerable<Models.Task>> GetTasksByStatusAsync(Models.TaskStatus status);
    Task<Models.Task?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default);
    Task AddTaskAsync(Models.Task task, CancellationToken cancellationToken = default);
    Task UpdateTaskAsync(Models.Task task);
    Task DeleteTaskAsync(Models.Task task, CancellationToken cancellationToken = default);
}
