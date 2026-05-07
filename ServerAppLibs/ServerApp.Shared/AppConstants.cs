namespace ServerApp.Shared;

public class AppConstants
{
    public class Settings
    {
        public const string DBProvider = "DBProvider"; // Key for the database provider setting in appsettings.json

        public string[] ValidDbProviders = ["sqlserver", "mongodb"]; // Valid database providers

        public class ConnectionStrings
        {
            public const string SQLServerConnection = "SQLServerConnection"; // Key for the SQL Server connection string in appsettings.json
            public const string RedisConnection = "RedisConnection"; // Key for the Redis connection string in appsettings.json
        }

        public class MongoDbOptions
        {
            public const string SectionName = "MongoDbOptions"; // Key for the MongoDB options section in appsettings.json
        }
    }
}
