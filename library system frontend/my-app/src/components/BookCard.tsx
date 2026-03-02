import type { Book } from '../types/book.types';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const navigate = useNavigate();

  const handleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/books/${book.isbn}`);
  };

  return (
    <div className="card h-100" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <p className="card-text text-muted small">ISBN: {book.isbn}</p>
        {book.description && (
          <p className="card-text">{book.description.substring(0, 100)}...</p>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <button 
          className="btn btn-sm btn-secondary" 
          onClick={handleOptions}
        >
          Options
        </button>
      </div>
    </div>
  );
}
