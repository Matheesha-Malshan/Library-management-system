using library_system_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace library_system_backend.Data;

public class LibraryDbContext:DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
    {
    }

    public DbSet<Book>  Books { get; set; }
    
}