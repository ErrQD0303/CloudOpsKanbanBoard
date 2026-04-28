namespace ServerApp.Models;

// Mapped to the Task table in the database
public class Task : AppBaseModel
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskStatus Status { get; set; } = TaskStatus.TODO;
}
