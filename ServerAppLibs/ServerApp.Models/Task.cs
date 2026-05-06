using MongoDB.Bson.Serialization.Attributes;

namespace ServerApp.Models;

// Mapped to the Task table in the database
public class Task : AppBaseModel
{
    // [BsonId] // Mark Id as the primary key for MongoDB
    // [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    // [BsonElement("Title")] // Just for clarity, this is optional as the property name matches the desired field name in MongoDB
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskStatus Status { get; set; } = TaskStatus.TODO;
}
