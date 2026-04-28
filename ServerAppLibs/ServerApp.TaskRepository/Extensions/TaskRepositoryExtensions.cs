using Microsoft.Extensions.DependencyInjection;

namespace ServerApp.TaskRepository.Extensions;

public static class TaskRepositoryExtensions
{
    public static void AddTaskRepository<TRepo>(this IServiceCollection services) where TRepo : class, ITaskRepository
    {
        services.AddScoped<ITaskRepository, TRepo>();
    }
}