import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { BookList } from '../components/BookList';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function BooksPage() {
  const navigate = useNavigate();
  const { books, loading, error, refetch } = useBooks();

  const handleBookClick = (isbn: string) => {
    navigate(`/books/${isbn}`);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Book Library</h1>
        <button className="btn btn-primary" onClick={() => navigate('/books/new')}>
          Add New Book
        </button>
      </div>

      <BookList 
        books={books} 
        onBookClick={handleBookClick}
      />
    </div>
  );
}
