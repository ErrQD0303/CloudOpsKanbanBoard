using Microsoft.Extensions.DependencyInjection;
using ServerApp.TaskRepository;
using ServerApp.TaskRepository.Extensions;

namespace ServerApp.UnitOfWork.Extensions;

public static class UnitOfWorkExtensions
{
    public static void AddUnitOfWork<TUnitOfWork, TRepository>(this IServiceCollection services) where TUnitOfWork : class, IUnitOfWork
    where TRepository : class, ITaskRepository
    {
        services.AddTaskRepository<TRepository>();
        services.AddScoped<IUnitOfWork, TUnitOfWork>();
    }
}