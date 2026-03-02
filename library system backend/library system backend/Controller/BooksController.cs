using library_system_backend.Dto;
using library_system_backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace library_system_backend.Controller;

[Route("api/[controller]")]
[ApiController]
public class BooksController: ControllerBase
{
    private readonly IBookService _bookService;
    
    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }
    
    [HttpPost("create-book")]
    public async Task<IActionResult> BookCreate([FromBody] BookCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdBook = await _bookService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { isbn = createdBook.Isbn }, createdBook);
    }

    [HttpGet("{isbn}")]
    public async Task<ActionResult<BookDto>> GetById(string isbn)
    {
        var book = await _bookService.GetByIdAsync(isbn);
        if (book == null) return NotFound(new { message = $"Book with ISBN {isbn} not found." });
        return Ok(book);
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllBooksAsync();
        return Ok(books);
       
    }

    [HttpPut("{isbn}")]
    public async Task<IActionResult> Update(string isbn, [FromBody] BookUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updatedBook = await _bookService.UpdateAsync(dto, isbn);
        if (updatedBook == null) return NotFound(new { message = $"Book with ISBN {isbn} not found." });
        return Ok(updatedBook);
    }

    [HttpDelete("{isbn}")]
    public async Task<IActionResult> Delete(string isbn)
    {
        var deleted = await _bookService.DeleteAsync(isbn);
        if (!deleted) return NotFound(new { message = $"Book with ISBN {isbn} not found." });
        return NoContent();
    }

}