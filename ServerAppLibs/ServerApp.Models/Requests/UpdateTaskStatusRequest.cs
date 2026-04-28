using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ServerApp.Models.Requests
{
    public class UpdateTaskStatusRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [Required]
        [JsonPropertyName("status")]
        public string Status { get; set; } = "TODO"; // Will be mapped to TaskStatus enum in the service layer
        [Required]
        [JsonPropertyName("row_version")]
        public byte[] RowVersion { get; set; } = []; // For optimistic concurrency control
    }
}