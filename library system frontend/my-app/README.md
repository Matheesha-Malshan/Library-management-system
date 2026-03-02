# Book Management Frontend

A simple CRUD application for managing books, built with React, TypeScript, and Bootstrap.

## Features

- View all books in a responsive grid
- Add new books
- View book details
- Edit existing books
- Delete books

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API URL:
   - Edit `.env` file and set `VITE_API_BASE_URL` to your backend API URL
   - Default: `http://localhost:5180`

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Tech Stack

- React 18
- TypeScript
- React Router v6
- Axios
- Bootstrap 5
- Vite

## API Endpoints

The app expects the following API endpoints:

- `GET /api/Books` - Get all books
- `GET /api/Books/{isbn}` - Get book by ISBN
- `POST /api/Books/create-book` - Create new book
- `PUT /api/Books/{isbn}` - Update book
- `DELETE /api/Books/{isbn}` - Delete book
