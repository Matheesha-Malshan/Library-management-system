using AutoMapper;
using library_system_backend.Data;
using library_system_backend.Dto;
using library_system_backend.Models;
using library_system_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace library_system_backend.Services;

public class BookService:IBookService
{
    private readonly LibraryDbContext  _context;
    private readonly IMapper _mapper;

    public BookService(LibraryDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<BookCreateDto> CreateAsync(BookCreateDto dto)
    {
        var book = _mapper.Map<Book>(dto);
        await _context.Books.AddAsync(book);
        await _context.SaveChangesAsync();
        return _mapper.Map<BookCreateDto>(book);
            
    }
    
    public async Task<BookDto?> UpdateAsync(BookUpdateDto dto, string isbn)
    {
        var book = await _context.Books.FindAsync(isbn);
        if (book == null)
        {
            return null;
        }

        _mapper.Map(dto, book);
        await _context.SaveChangesAsync();
        return _mapper.Map<BookDto>(book);
    }

    public async Task<bool> DeleteAsync(string isbn)
    {
        var book = await _context.Books.FindAsync(isbn);
        if (book == null) return false;

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<BookDto?> GetByIdAsync(string isbn)
    {
        var book = await _context.Books.FindAsync(isbn);
        if (book == null)
            return null;

        return _mapper.Map<BookDto>(book);
    }

    public async Task<List<BookDto>> GetAllBooksAsync()
    {
        var books = await _context.Books.ToListAsync();
        return _mapper.Map<List<BookDto>>(books);
    }
}