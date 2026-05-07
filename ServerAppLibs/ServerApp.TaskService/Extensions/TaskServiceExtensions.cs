using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace ServerApp.TaskService.Extensions
{
    public static class TaskServiceExtensions
    {
        public static void AddTaskService<TService>(this IServiceCollection services) where TService : class, ITaskService
        {
            services.AddScoped<ITaskService, TService>();
        }
    }
}