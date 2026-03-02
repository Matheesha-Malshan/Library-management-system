import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import { useNotification } from '../hooks/useNotification';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Notification } from '../components/Notification';
import { bookService, handleApiError } from '../services/bookService';

export function BookDetailPage() {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const { book, loading, error } = useBook(isbn!);
  const { notification, showNotification, hideNotification } = useNotification();

  const handleDelete = async () => {
    if (!isbn || !window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.deleteBook(isbn);
      showNotification('Book deleted successfully', 'success');
      setTimeout(() => navigate('/books'), 1000);
    } catch (err) {
      const apiError = handleApiError(err);
      showNotification(apiError.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !book) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error || 'Book not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/books')}>
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/books')}>
          ← Back
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate(`/books/${isbn}/edit`)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h1 className="card-title">{book.title}</h1>
          <h5 className="card-subtitle mb-3 text-muted">by {book.author}</h5>
          
          <div className="mb-3">
            <strong>ISBN:</strong> {book.isbn}
          </div>
          
          <div className="mb-3">
            <strong>Publish Date:</strong> {new Date(book.publishDate).toLocaleDateString()}
          </div>

          {book.description && (
            <div>
              <strong>Description:</strong>
              <p className="mt-2">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <Notification notification={notification} onDismiss={hideNotification} />
      )}
    </div>
  );
}
