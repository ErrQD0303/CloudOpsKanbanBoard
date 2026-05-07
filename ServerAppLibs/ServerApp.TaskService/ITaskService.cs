using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ServerApp.Models.Requests;

namespace ServerApp.TaskService
{
    public interface ITaskService
    {
        Task<IEnumerable<Models.Task>> GetAllTasksAsync();
        Task<IEnumerable<Models.Task>> GetTasksByStatusAsync(Models.TaskStatus status);
        Task<Models.Task?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<Models.Task?> AddTaskAsync(CreateTaskRequest task, CancellationToken cancellationToken = default);
        Task<Models.Task?> UpdateTaskAsync(UpdateTaskRequest request, CancellationToken cancellationToken = default);
        Task<Models.Task?> UpdateTaskStatusAsync(UpdateTaskStatusRequest request, CancellationToken cancellationToken = default);
        Task DeleteTaskAsync(string id, CancellationToken cancellationToken = default);
    }
}