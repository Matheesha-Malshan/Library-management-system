import type { Book } from '../types/book.types';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  onBookClick: (isbn: string) => void;
}

export function BookList({ books, onBookClick }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No books available
      </div>
    );
  }

  return (
    <div className="row g-3">
      {books.map((book) => (
        <div key={book.isbn} className="col-md-6 col-lg-4">
          <BookCard
            book={book}
            onClick={() => onBookClick(book.isbn)}
          />
        </div>
      ))}
    </div>
  );
}
