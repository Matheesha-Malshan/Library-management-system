using library_system_backend.Dto;
using library_system_backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace library_system_backend.Services.Interfaces;

public interface IBookService
{
    public Task<BookCreateDto> CreateAsync(BookCreateDto book);
    public Task<BookDto?> UpdateAsync(BookUpdateDto dto, string isbn);
    public Task<bool> DeleteAsync(string isbn);

    public Task<List<BookDto>> GetAllBooksAsync();
    public Task<BookDto?> GetByIdAsync(string isbn);
  
}