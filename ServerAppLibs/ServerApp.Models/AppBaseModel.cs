using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models;

public class AppBaseModel
{
    [Timestamp]
    public byte[] RowVersion { get; set; } = []; // For optimistic concurrency control
}