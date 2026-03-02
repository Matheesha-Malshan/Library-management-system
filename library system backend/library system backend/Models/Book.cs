using System.ComponentModel.DataAnnotations;

namespace library_system_backend.Models;

public class Book
{
    [Key] 
    [MaxLength(50)]
    public string Isbn { get; set; } = "";
    [MaxLength(50)]
    public string Title { get; set; } = "";
    [MaxLength(50)]
    public string Author { get; set; } = "";
    [MaxLength(100)]
    public string Description { get; set; } = "";
    public DateTime PublishDate { get; set; }
}