using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MongoDB.Bson;
using MongoDB.EntityFrameworkCore.Extensions;

namespace ServerApp.MongoDbTaskRepository.Data;

public class MongoDBApplicationDbContext : DbContext
{
    public DbSet<Models.Task> Tasks { get; set; }

    public MongoDBApplicationDbContext(DbContextOptions<MongoDBApplicationDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Models.Task>(entity =>
        {
            entity.ToCollection(nameof(Tasks)); // Specify the MongoDB collection name

            entity.Property(e => e.Id)
                .HasElementName("_id"); // Map the Id property to MongoDB's _id field, which means the Id property will be the primary key in MongoDB
                                        // .HasConversion<ObjectId>(); // Map the Id property to MongoDB's _id field and convert it to ObjectId type

            entity.Property(e => e.Title)
                .HasElementName("Title"); // Map the Title property to the "Title" field in MongoDB

            entity.Property(e => e.Description)
                .HasElementName("Description"); // Map the Description property to the "Description" field

            entity.Property(e => e.Status)
                .HasElementName("Status"); // Map the Status property to the "Status" field

            entity.Property(e => e.RowVersion)
                .HasElementName("RowVersion") // Map the RowVersion property to the "RowVersion" field in MongoDB
                .IsConcurrencyToken(); // Mark RowVersion as a concurrency token for optimistic concurrency control
        });
    }

    private void UpdateRowVersion()
    {
        var entries = ChangeTracker.Entries<Models.Task>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            entry.Entity.RowVersion = BitConverter.GetBytes(DateTime.UtcNow.Ticks);
        }
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateRowVersion();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateRowVersion();
        return base.SaveChanges();
    }
}