namespace ServerApp.Shared;

public static class Mappers
{
    public static Models.Task MapToTaskModel(this Models.Requests.CreateTaskRequest request)
    {
        return new Models.Task
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Description = request.Description,
            Status = Enum.TryParse<Models.TaskStatus>(request.Status, true, out var status) ? status : Models.TaskStatus.TODO
        };
    }

    public static Models.Responses.FrontendTaskModel MapToFrontendTaskModel(this Models.Task task)
    {
        return new Models.Responses.FrontendTaskModel
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            RowVersion = task.RowVersion
        };
    }

    public static Models.Task MapToTaskModel(this Models.Requests.UpdateTaskRequest request, Models.Task existingTask)
    {
        return new Models.Task
        {
            Id = existingTask.Id, // Keep the same ID
            Title = request.Title,
            Description = request.Description,
            Status = Enum.TryParse<Models.TaskStatus>(request.Status, true, out var status) ? status : existingTask.Status,
            RowVersion = existingTask.RowVersion // Keep the same RowVersion for concurrency control
        };
    }
}