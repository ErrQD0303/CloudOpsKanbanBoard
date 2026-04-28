using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models.Requests;

public class CreateTaskRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "TODO"; // Will be mapped to TaskStatus enum in the service layer
}
