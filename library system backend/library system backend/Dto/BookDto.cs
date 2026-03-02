using System.ComponentModel.DataAnnotations;

namespace library_system_backend.Dto;

public class BookDto
{
    public string Isbn { get; set; } = "";
    [Required]
    public string Title { get; set; } = "";
    [Required]
    public string Author { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime PublishDate { get; set; }
}