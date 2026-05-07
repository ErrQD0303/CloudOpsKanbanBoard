using Microsoft.Extensions.Logging;
using ServerApp.Models.Requests;
using ServerApp.Shared;
using ServerApp.UnitOfWork;

namespace ServerApp.TaskService;

public class TaskService(IUnitOfWork _unitOfWork, ILogger<TaskService> _logger) : ITaskService
{
    public async Task<Models.Task?> AddTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var task = request.MapToTaskModel();
        _logger.LogInformation("Adding task {TaskId}", task.Id);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            await _unitOfWork.Tasks.AddTaskAsync(task, cancellationToken);
            var rowChanges = await _unitOfWork.CompleteAsync(cancellationToken);
            if (rowChanges > 0)
            {
                _logger.LogInformation("Task {TaskId} added successfully with {RowChanges} changes", task.Id, rowChanges);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);
                return task;
            }

            _logger.LogWarning("No changes were made when adding task {TaskId}", task.Id);
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding task {TaskId}", task.Id);

            await _unitOfWork.RollbackTransactionAsync(cancellationToken);

            throw;
        }
    }

    public async Task DeleteTaskAsync(string id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting task {TaskId}", id);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var task = await _unitOfWork.Tasks.GetTaskByIdAsync(id, cancellationToken);
            if (task == null)
            {
                _logger.LogWarning("Task {TaskId} not found for deletion", id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return;
            }

            await _unitOfWork.Tasks.DeleteTaskAsync(task, cancellationToken);
            await _unitOfWork.CompleteAsync(cancellationToken);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            _logger.LogInformation("Task {TaskId} deleted successfully", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId}", id);

            await _unitOfWork.RollbackTransactionAsync(cancellationToken);

            throw;
        }
    }

    public Task<IEnumerable<Models.Task>> GetAllTasksAsync()
    {
        return _unitOfWork.Tasks.GetAllTasksAsync();
    }

    public Task<Models.Task?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return _unitOfWork.Tasks.GetTaskByIdAsync(id, cancellationToken);
    }

    public Task<IEnumerable<Models.Task>> GetTasksByStatusAsync(Models.TaskStatus status)
    {
        return _unitOfWork.Tasks.GetTasksByStatusAsync(status);
    }

    public async Task<Models.Task?> UpdateTaskAsync(UpdateTaskRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating task {TaskId}", request.Id);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var dbTask = await _unitOfWork.Tasks.GetTaskByIdAsync(request.Id, cancellationToken);
            if (dbTask == null)
            {
                _logger.LogWarning("Task {TaskId} not found for update", request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return null;
            }

            if (!dbTask.RowVersion.SequenceEqual(request.RowVersion)) // Optimistic concurrency check
            {
                _logger.LogWarning("Concurrency conflict detected for task {TaskId}", request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new InvalidOperationException($"Task with ID {request.Id} has been modified by another process. Please reload and try again.");
            }
            dbTask.Title = request.Title;
            dbTask.Description = request.Description;
            if (!Enum.TryParse<Models.TaskStatus>(request.Status, true, out var newStatus))
            {
                _logger.LogWarning("Invalid status value '{Status}' provided for task {TaskId}", request.Status, request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new ArgumentException($"Invalid status value: {request.Status}");
            }
            dbTask.Status = newStatus;
            await _unitOfWork.Tasks.UpdateTaskAsync(dbTask);
            var rowChanges = await _unitOfWork.CompleteAsync(cancellationToken);
            if (rowChanges > 0)
            {
                _logger.LogInformation("Task {TaskId} updated successfully with {RowChanges} changes", request.Id, rowChanges);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);
                return await _unitOfWork.Tasks.GetTaskByIdAsync(request.Id, cancellationToken); // Return the updated task with the new RowVersion
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId}", request.Id);

            await _unitOfWork.RollbackTransactionAsync(cancellationToken);

            throw;
        }
    }

    public async Task<Models.Task?> UpdateTaskStatusAsync(UpdateTaskStatusRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating status of task {TaskId} to {NewStatus}", request.Id, request.Status);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var task = await _unitOfWork.Tasks.GetTaskByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                _logger.LogWarning("Task {TaskId} not found for status update", request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return null;
            }

            if (!task.RowVersion.SequenceEqual(request.RowVersion)) // Optimistic concurrency check
            {
                _logger.LogWarning("Concurrency conflict detected for task {TaskId} during status update", request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new InvalidOperationException($"Task with ID {request.Id} has been modified by another process. Please reload and try again.");
            }

            if (!Enum.TryParse<Models.TaskStatus>(request.Status, true, out var newStatus))
            {
                _logger.LogWarning("Invalid status value '{Status}' provided for task {TaskId}", request.Status, request.Id);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new ArgumentException($"Invalid status value: {request.Status}");
            }

            task.Status = newStatus;
            await _unitOfWork.Tasks.UpdateTaskAsync(task);
            var rowChanges = await _unitOfWork.CompleteAsync(cancellationToken);
            if (rowChanges > 0)
            {
                _logger.LogInformation("Status of task {TaskId} updated successfully to {NewStatus} with {RowChanges} changes", request.Id, newStatus, rowChanges);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);
                return task;
            }

            _logger.LogWarning("No changes were made when updating status of task {TaskId}", request.Id);
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status of task {TaskId}", request.Id);

            await _unitOfWork.RollbackTransactionAsync(cancellationToken);

            throw;
        }
    }
}
