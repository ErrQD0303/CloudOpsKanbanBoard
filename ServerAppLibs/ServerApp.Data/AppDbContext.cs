using Microsoft.EntityFrameworkCore;

namespace ServerApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Models.Task> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the Task entity
        modelBuilder.Entity<Models.Task>(entity =>
        {
            entity.ToTable(nameof(Tasks)); // Map to the Tasks table in the database
            entity.HasKey(e => e.Id)
                .IsClustered(false); // Set Id as the primary key and non-clustered, because Id is a string and not ideal for clustered index (NUSE rules recommend clustered index on narrow, unique, static, and ever-increasing columns, which is not the case for string Ids)
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200); // Title is required
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(2000); // Description is required
            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<int>(); // Store the TaskStatus enum as an integer in the database

            // Indexed columns
            entity.HasIndex(e => e.Status); // Create a non-clustered index on the Status column to optimize queries filtering by status
        });
    }
}
