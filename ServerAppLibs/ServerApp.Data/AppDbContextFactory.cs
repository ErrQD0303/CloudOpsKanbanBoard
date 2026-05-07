using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ServerApp.Shared;

namespace ServerApp.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        ConfigurationBuilder configBuilder = new();
        configBuilder.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        IConfiguration config = configBuilder.Build();

        DbContextOptionsBuilder<AppDbContext> optionsBuilder = new();

        optionsBuilder.UseSqlServer(config.GetConnectionString(AppConstants.Settings.ConnectionStrings.SQLServerConnection));

        return new AppDbContext(optionsBuilder.Options);
    }
}