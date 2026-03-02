# Library Management System - Backend

A .NET 9 Web API for managing books in a library system.

## Features

- RESTful API for CRUD operations on books
- SQLite database with Entity Framework Core
- AutoMapper for DTO mapping
- Swagger/OpenAPI documentation
- CORS enabled for frontend integration

## Technologies

- ASP.NET Core 9
- Entity Framework Core 9
- SQLite
- AutoMapper
- Swagger/OpenAPI

## Getting Started

### Prerequisites

- .NET 9 SDK
- A code editor (VS Code, Visual Studio, or Rider)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd "library system backend/library system backend"
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run --urls="http://localhost:5180"
   ```

4. The API will be available at:
   - API: http://localhost:5180
   - Swagger UI: http://localhost:5180/swagger

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Books` | Get all books |
| GET | `/api/Books/{isbn}` | Get book by ISBN |
| POST | `/api/Books/create-book` | Create new book |
| PUT | `/api/Books/{isbn}` | Update book |
| DELETE | `/api/Books/{isbn}` | Delete book |

## Request/Response Examples

### Create Book
```json
POST /api/Books/create-book
{
  "isbn": "978-0-13-468599-1",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "description": "A Handbook of Agile Software Craftsmanship",
  "publishDate": "2008-08-01"
}
```

### Update Book
```json
PUT /api/Books/978-0-13-468599-1
{
  "title": "Clean Code - Updated",
  "author": "Robert C. Martin",
  "description": "A Handbook of Agile Software Craftsmanship",
  "publishDate": "2008-08-01"
}
```

## Project Structure

```
library system backend/
├── library system backend/
│   ├── Controller/
│   │   └── BooksController.cs     # API endpoints
│   ├── Data/
│   │   └── LibraryDbContext.cs    # Database context
│   ├── Dto/
│   │   ├── BookCreateDto.cs       # Create DTO
│   │   ├── BookUpdateDto.cs       # Update DTO
│   │   └── BookDto.cs             # Response DTO
│   ├── Mappers/
│   │   └── MappingProfile.cs      # AutoMapper config
│   ├── Models/
│   │   └── Book.cs                 # Entity model
│   ├── Services/
│   │   ├── BookService.cs         # Business logic
│   │   └── Interfaces/
│   │       └── IBookService.cs    # Service interface
│   ├── Program.cs                  # App configuration
│   └── appsettings.json            # App settings
└── library system backend.sln
```

## Database

The application uses SQLite database (`app.db`) which is automatically created on first run.

## License

MIT
