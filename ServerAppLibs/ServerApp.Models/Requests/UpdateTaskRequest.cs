using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ServerApp.Models.Requests;

public class UpdateTaskRequest
{
    [Required]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    [Required]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "TODO"; // Will be mapped to TaskStatus enum in the service layer
    [Required]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [Required]
    [JsonPropertyName("row_version")]
    public byte[] RowVersion { get; set; } = []; // For optimistic concurrency control
}