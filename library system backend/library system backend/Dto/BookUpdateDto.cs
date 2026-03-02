namespace library_system_backend.Dto;

public class BookUpdate
{
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime PublishDate { get; set; }
}