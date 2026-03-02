# Design Document: Book Management Frontend

## Overview

The Book Management Frontend is a single-page application (SPA) built with React 18 and TypeScript that provides a modern, responsive interface for managing a library's book collection. The application follows a component-based architecture with clear separation of concerns between UI components, state management, API communication, and routing.

The application consumes a RESTful API (documented in swagger.json) and implements all CRUD operations with proper error handling, loading states, and user feedback. The design emphasizes type safety through TypeScript, reusable components, and a clean architecture that makes the codebase maintainable and testable.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages/     │  │  Components/ │  │   Hooks/     │  │
│  │   Views      │◄─┤   (UI)       │◄─┤   (Logic)    │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
│                                              │          │
│  ┌──────────────────────────────────────────▼───────┐  │
│  │          Services (API Communication)            │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼───────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │  (swagger.json)    │
                    └────────────────────┘
```

### Technology Stack

- **React 18**: UI framework with hooks and functional components
- **TypeScript**: Type-safe development
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API communication
- **CSS Modules or Styled Components**: Component-scoped styling
- **Vite**: Build tool and development server (already configured)

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookCard.tsx
│   ├── BookForm.tsx
│   ├── BookList.tsx
│   ├── ConfirmDialog.tsx
│   ├── LoadingSpinner.tsx
│   └── Notification.tsx
├── pages/              # Page-level components
│   ├── BooksPage.tsx
│   ├── BookDetailPage.tsx
│   ├── CreateBookPage.tsx
│   └── EditBookPage.tsx
├── services/           # API communication
│   └── bookService.ts
├── types/              # TypeScript type definitions
│   └── book.types.ts
├── hooks/              # Custom React hooks
│   ├── useBooks.ts
│   ├── useNotification.ts
│   └── useConfirm.ts
├── utils/              # Utility functions
│   └── validation.ts
├── App.tsx             # Root component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Components and Interfaces

### Type Definitions

Based on the Swagger specification, we define the following TypeScript interfaces:

```typescript
// types/book.types.ts

export interface Book {
  isbn: string;
  title: string;
  author: string;
  description: string;
  publishDate: string; // ISO 8601 date-time string
}

export interface BookCreateDto {
  isbn: string;
  title: string;
  author: string;
  description: string;
  publishDate: string;
}

export interface BookUpdateDto {
  title: string;
  author: string;
  description: string;
  publishDate: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ValidationErrors {
  isbn?: string;
  title?: string;
  author?: string;
  description?: string;
  publishDate?: string;
}
```

### API Service Layer

The API service encapsulates all HTTP communication:

```typescript
// services/bookService.ts

import axios, { AxiosError } from 'axios';
import { Book, BookCreateDto, BookUpdateDto, ApiError } from '../types/book.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  // Get all books
  async getAllBooks(): Promise<Book[]> {
    const response = await apiClient.get<Book[]>('/api/Books');
    return response.data;
  },

  // Get book by ISBN
  async getBookByIsbn(isbn: string): Promise<Book> {
    const response = await apiClient.get<Book>(`/api/Books/${isbn}`);
    return response.data;
  },

  // Create new book
  async createBook(book: BookCreateDto): Promise<void> {
    await apiClient.post('/api/Books/create-book', book);
  },

  // Update existing book
  async updateBook(isbn: string, book: BookUpdateDto): Promise<void> {
    await apiClient.put(`/api/Books/${isbn}`, book);
  },

  // Delete book
  async deleteBook(isbn: string): Promise<void> {
    await apiClient.delete(`/api/Books/${isbn}`);
  },
};

// Error handler utility
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      status: axiosError.response?.status,
    };
  }
  return {
    message: 'An unexpected error occurred',
  };
}
```

### Custom Hooks

#### useBooks Hook

Manages book-related state and operations:

```typescript
// hooks/useBooks.ts

import { useState, useEffect } from 'react';
import { Book, BookCreateDto, BookUpdateDto } from '../types/book.types';
import { bookService, handleApiError } from '../services/bookService';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books, loading, error, refetch: fetchBooks };
}

export function useBook(isbn: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookService.getBookByIsbn(isbn);
        setBook(data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    if (isbn) {
      fetchBook();
    }
  }, [isbn]);

  return { book, loading, error };
}
```

#### useNotification Hook

Manages notification state:

```typescript
// hooks/useNotification.ts

import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
}
```

### Core Components

#### BookList Component

Displays books in a responsive grid:

```typescript
// components/BookList.tsx

interface BookListProps {
  books: Book[];
  onBookClick: (isbn: string) => void;
  onDeleteClick: (isbn: string) => void;
}

export function BookList({ books, onBookClick, onDeleteClick }: BookListProps) {
  if (books.length === 0) {
    return <div className="empty-state">No books available</div>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.isbn}
          book={book}
          onClick={() => onBookClick(book.isbn)}
          onDelete={() => onDeleteClick(book.isbn)}
        />
      ))}
    </div>
  );
}
```

#### BookForm Component

Handles book creation and editing:

```typescript
// components/BookForm.tsx

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: BookCreateDto | BookUpdateDto) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function BookForm({ initialData, onSubmit, onCancel, isEditMode }: BookFormProps) {
  const [formData, setFormData] = useState({
    isbn: initialData?.isbn || '',
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    publishDate: initialData?.publishDate || '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.isbn && !isEditMode) {
      newErrors.isbn = 'ISBN is required';
    }
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    if (!formData.author) {
      newErrors.author = 'Author is required';
    }
    if (!formData.publishDate) {
      newErrors.publishDate = 'Publish date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const { isbn, ...updateData } = formData;
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form JSX with input fields, validation errors, and buttons
}
```

### Routing Structure

```typescript
// App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/new" element={<CreateBookPage />} />
            <Route path="/books/:isbn" element={<BookDetailPage />} />
            <Route path="/books/:isbn/edit" element={<EditBookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

## Data Models

### Book Data Flow

1. **Fetching Books**: API returns `Book[]` → stored in component state → rendered in UI
2. **Creating Book**: User input → `BookCreateDto` → API → success → refetch books
3. **Updating Book**: Existing `Book` → pre-fill form → user edits → `BookUpdateDto` → API → success → refetch
4. **Deleting Book**: User confirms → ISBN → API → success → remove from local state

### State Management Strategy

The application uses React's built-in state management:

- **Local component state**: For form inputs, UI toggles
- **Custom hooks**: For shared logic (useBooks, useNotification)
- **URL state**: For current book ISBN (via React Router params)
- **No global state library needed**: Application complexity doesn't warrant Redux/Zustand

### Date Handling

The API uses ISO 8601 date-time strings. The frontend will:
- Store dates as strings in the format received from API
- Use HTML5 `<input type="datetime-local">` for date input
- Convert between ISO 8601 and datetime-local format as needed

```typescript
// utils/dateUtils.ts

export function toDateTimeLocal(isoString: string): string {
  return isoString.slice(0, 16); // "2024-01-15T10:30:00Z" → "2024-01-15T10:30"
}

export function toISOString(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString();
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Book List Rendering Completeness

*For any* list of books returned from the API, the rendered BookList component should display each book's title, author, and ISBN in the output.

**Validates: Requirements 1.2**

### Property 2: API Service Method Invocation

*For any* CRUD operation (create, read, update, delete), invoking the corresponding operation through the UI should call the correct API service method with the appropriate parameters and HTTP method.

**Validates: Requirements 2.2, 3.2, 4.2, 5.2**

### Property 3: Form Validation Completeness

*For any* book form submission, if any required field (ISBN for create, title, author, publishDate) is empty or invalid, the validation function should return errors for those specific fields and prevent submission.

**Validates: Requirements 2.6, 6.5, 6.6**

### Property 4: Success Notification Display

*For any* successful API operation (create, update, delete), the system should display a success notification message to the user.

**Validates: Requirements 2.3, 4.3, 5.3**

### Property 5: Error Message Display

*For any* failed API operation, the system should display an error message containing information about the failure.

**Validates: Requirements 1.4, 2.4, 4.4, 5.4, 9.3**

### Property 6: Form Data Preservation on Error

*For any* book form (create or edit), if submission fails due to an API error, the form data should remain unchanged and available for correction.

**Validates: Requirements 2.4, 4.4**

### Property 7: Book Detail Display Completeness

*For any* book retrieved by ISBN, the BookDetailView should display all book properties: ISBN, title, author, description, and publishDate.

**Validates: Requirements 3.3**

### Property 8: Edit Form Pre-population

*For any* existing book, when entering edit mode, the form should be pre-filled with all current book data (title, author, description, publishDate).

**Validates: Requirements 4.1**

### Property 9: Post-Deletion List Consistency

*For any* book that is successfully deleted, that book should no longer appear in the book list after the deletion completes.

**Validates: Requirements 5.3**

### Property 10: URL-View Consistency

*For any* navigation action within the application, the URL path should accurately reflect the current view and contain necessary parameters (e.g., ISBN for detail/edit views).

**Validates: Requirements 7.5**

### Property 11: Loading State During API Operations

*For any* in-progress API operation, the system should display a loading indicator and disable action buttons until the operation completes.

**Validates: Requirements 9.1, 9.5**

### Property 12: API Error Handler Consistency

*For any* API error (network failure, non-200 status code), the error handler should return a descriptive error message that can be displayed to the user.

**Validates: Requirements 10.3, 10.4**

### Property 13: API Request Headers

*For any* API request made through the bookService, the request should include the Content-Type header set to 'application/json'.

**Validates: Requirements 10.2**

## Error Handling

### Error Categories

1. **Network Errors**: Connection failures, timeouts
2. **HTTP Errors**: 4xx client errors, 5xx server errors
3. **Validation Errors**: Invalid user input
4. **Not Found Errors**: Book doesn't exist (404)

### Error Handling Strategy

```typescript
// Centralized error handling in API service
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Network error
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your connection.',
      };
    }
    
    // HTTP error with response
    const status = axiosError.response.status;
    
    if (status === 404) {
      return {
        message: 'Book not found.',
        status: 404,
      };
    }
    
    if (status >= 400 && status < 500) {
      return {
        message: axiosError.response.data?.message || 'Invalid request.',
        status,
      };
    }
    
    if (status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        status,
      };
    }
    
    return {
      message: axiosError.message,
      status,
    };
  }
  
  return {
    message: 'An unexpected error occurred.',
  };
}
```

### Error Display

- **Toast Notifications**: For operation feedback (success/error)
- **Inline Validation**: For form field errors
- **Error Pages**: For 404 and critical errors
- **Retry Options**: For network failures

### Form Validation

Validation occurs at two levels:

1. **Client-side validation**: Immediate feedback, prevents unnecessary API calls
2. **Server-side validation**: Backend validates data (assumed from API design)

```typescript
// utils/validation.ts

export function validateBookForm(
  data: Partial<BookCreateDto>,
  isEditMode: boolean
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!isEditMode && !data.isbn?.trim()) {
    errors.isbn = 'ISBN is required';
  }
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!data.author?.trim()) {
    errors.author = 'Author is required';
  }
  
  if (!data.publishDate) {
    errors.publishDate = 'Publish date is required';
  } else {
    // Validate date format
    const date = new Date(data.publishDate);
    if (isNaN(date.getTime())) {
      errors.publishDate = 'Invalid date format';
    }
  }
  
  return errors;
}
```

## Testing Strategy

### Dual Testing Approach

The application will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

We will use **fast-check** (a property-based testing library for TypeScript/JavaScript) to implement the correctness properties defined above.

**Configuration**:
- Minimum 100 iterations per property test
- Each test will be tagged with a comment referencing its design property
- Tag format: `// Feature: book-management-frontend, Property {number}: {property_text}`

**Example Property Test**:

```typescript
// BookList.test.tsx
import fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { BookList } from './BookList';

// Feature: book-management-frontend, Property 1: Book List Rendering Completeness
test('BookList displays all book properties for any list of books', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          isbn: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1 }),
          author: fc.string({ minLength: 1 }),
          description: fc.string(),
          publishDate: fc.date().map(d => d.toISOString()),
        })
      ),
      (books) => {
        const { container } = render(
          <BookList 
            books={books} 
            onBookClick={() => {}} 
            onDeleteClick={() => {}} 
          />
        );
        
        // Verify each book's required properties are displayed
        books.forEach(book => {
          expect(container.textContent).toContain(book.title);
          expect(container.textContent).toContain(book.author);
          expect(container.textContent).toContain(book.isbn);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

Unit tests will focus on:

1. **Component rendering**: Verify components render correctly with specific props
2. **User interactions**: Test button clicks, form submissions, navigation
3. **Edge cases**: Empty lists, missing data, invalid inputs
4. **Error scenarios**: API failures, validation errors, 404 responses
5. **Integration points**: Component communication, routing behavior

**Testing Tools**:
- **Vitest**: Test runner (already configured with Vite)
- **React Testing Library**: Component testing
- **fast-check**: Property-based testing
- **MSW (Mock Service Worker)**: API mocking for integration tests

**Example Unit Test**:

```typescript
// BookForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from './BookForm';

test('displays validation error when title is empty', async () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  
  render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);
  
  // Try to submit with empty title
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });
  
  expect(onSubmit).not.toHaveBeenCalled();
});

test('ISBN field is disabled in edit mode', () => {
  const book = {
    isbn: '978-0-123456-78-9',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description',
    publishDate: '2024-01-01T00:00:00Z',
  };
  
  render(
    <BookForm 
      initialData={book} 
      onSubmit={vi.fn()} 
      onCancel={vi.fn()} 
      isEditMode={true} 
    />
  );
  
  const isbnInput = screen.getByLabelText(/isbn/i);
  expect(isbnInput).toBeDisabled();
});
```

### Test Coverage Goals

- **Component coverage**: 80%+ for all UI components
- **Service coverage**: 90%+ for API service and utilities
- **Property tests**: All 13 correctness properties implemented
- **Integration tests**: Key user flows (create, edit, delete book)

### Testing Best Practices

1. **Test behavior, not implementation**: Focus on what users see and do
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock external dependencies**: Use MSW for API mocking
4. **Test accessibility**: Ensure components are accessible
5. **Keep tests simple**: Each test should verify one thing
6. **Property tests for core logic**: Use property-based testing for validation, data transformations, and business logic

## Styling and Responsive Design

### Styling Approach

Use **CSS Modules** for component-scoped styling:

```typescript
// BookCard.module.css
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

// BookCard.tsx
import styles from './BookCard.module.css';

export function BookCard({ book }: BookCardProps) {
  return <div className={styles.card}>...</div>;
}
```

### Responsive Breakpoints

```css
/* Mobile first approach */
:root {
  --mobile: 320px;
  --tablet: 768px;
  --desktop: 1024px;
  --wide: 1440px;
}

/* Book grid responsive layout */
.book-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr; /* Mobile: single column */
}

@media (min-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .book-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

@media (min-width: 1440px) {
  .book-grid {
    grid-template-columns: repeat(4, 1fr); /* Wide: 4 columns */
  }
}
```

### Design System

**Color Palette**:
```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --surface: #f9fafb;
  --border: #e5e7eb;
}
```

**Typography**:
```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
}
```

**Spacing Scale**:
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Accessibility

- **Semantic HTML**: Use proper heading hierarchy, landmarks
- **ARIA labels**: For icon buttons and dynamic content
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Focus indicators**: Visible focus states for all interactive elements
- **Color contrast**: WCAG AA compliance (4.5:1 for normal text)
- **Screen reader support**: Proper labels and announcements

```typescript
// Example: Accessible delete button
<button
  onClick={handleDelete}
  aria-label={`Delete book ${book.title}`}
  className={styles.deleteButton}
>
  <TrashIcon aria-hidden="true" />
</button>
```

## Performance Considerations

### Optimization Strategies

1. **Code splitting**: Lazy load routes with React.lazy()
2. **Memoization**: Use React.memo() for expensive components
3. **Debouncing**: For search/filter inputs (if added)
4. **Optimistic updates**: Update UI before API confirmation for better UX
5. **Error boundaries**: Catch and handle component errors gracefully

```typescript
// Lazy loading routes
const BooksPage = lazy(() => import('./pages/BooksPage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:isbn" element={<BookDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Size

- Keep dependencies minimal
- Use tree-shaking (Vite handles this automatically)
- Analyze bundle with `vite-bundle-visualizer` if needed

## Deployment Considerations

### Environment Configuration

```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:5000

// .env.production
VITE_API_BASE_URL=https://api.production.com
```

### Build Output

```bash
npm run build
# Outputs to dist/ directory
# Static files ready for deployment to any hosting service
```

### Hosting Options

- **Vercel**: Zero-config deployment for Vite apps
- **Netlify**: Simple static hosting with CI/CD
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for public repos

### CORS Configuration

The backend API must be configured to accept requests from the frontend domain:

```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```
