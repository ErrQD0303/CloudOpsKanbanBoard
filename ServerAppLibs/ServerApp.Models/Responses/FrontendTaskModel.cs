using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ServerApp.Models.Responses
{
    public class FrontendTaskModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
        [JsonPropertyName("status")]
        public string Status { get; set; } = "TODO"; // Will be mapped to TaskStatus enum in the service layer
        [JsonPropertyName("row_version")]
        public byte[] RowVersion { get; set; } = []; // For optimistic concurrency control
    }
}