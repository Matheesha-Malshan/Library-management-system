using System.ComponentModel.DataAnnotations;

namespace library_system_backend.Dto;

public class BookCreateDto
{
    [Required]
    [StringLength(13, MinimumLength = 10)]
    public string Isbn { get; set; } = "";
    [Required]
    public string Title { get; set; } = "";
    [Required]
    public string Author { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime PublishDate { get; set; }
}