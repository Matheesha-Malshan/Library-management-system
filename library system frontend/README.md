# Library Management System - Frontend

A React-based web application for managing books in a library system.

## Features

- View all books in a responsive grid layout
- Create new books with form validation
- View book details
- Edit book information
- Delete books with confirmation
- Real-time notifications
- Loading states
- Error handling

## Technologies

- React 19
- TypeScript
- React Router DOM v7
- Axios
- Bootstrap 5
- Vite 7

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd "library system frontend/my-app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API URL (optional):
   - Edit `.env` file to set your backend URL
   - Default: `http://localhost:5180`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at:
   - http://localhost:5173 (or http://localhost:5174)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── BookCard.tsx         # Book card component
│   │   ├── BookForm.tsx         # Book create/edit form
│   │   ├── BookList.tsx         # Book list grid
│   │   ├── LoadingSpinner.tsx   # Loading indicator
│   │   ├── Navigation.tsx        # Navbar
│   │   └── Notification.tsx      # Toast notifications
│   ├── pages/
│   │   ├── BooksPage.tsx         # Main book list
│   │   ├── BookDetailPage.tsx   # View book details
│   │   ├── CreateBookPage.tsx   # Create new book
│   │   └── EditBookPage.tsx     # Edit existing book
│   ├── hooks/
│   │   ├── useBooks.ts           # Books data hook
│   │   └── useNotification.ts   # Notification hook
│   ├── services/
│   │   └── bookService.ts       # API service
│   ├── types/
│   │   └── book.types.ts        # TypeScript types
│   ├── utils/
│   │   └── validation.ts        # Form validation
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── .env                         # Environment variables
├── package.json
└── vite.config.ts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |

## API Integration

The frontend communicates with the backend using Axios. The service layer handles all API calls:

```typescript
// Available methods
bookService.getAllBooks()
bookService.getBookByIsbn(isbn)
bookService.createBook(book)
bookService.updateBook(isbn, book)
bookService.deleteBook(isbn)
```

## Building for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## License

MIT
