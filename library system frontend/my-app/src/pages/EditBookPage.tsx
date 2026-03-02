import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import { useNotification } from '../hooks/useNotification';
import { BookForm } from '../components/BookForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Notification } from '../components/Notification';

import { bookService, handleApiError } from '../services/bookService';

import type { BookUpdateDto } from '../types/book.types';

export function EditBookPage() {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const { book, loading, error } = useBook(isbn!);
  const { notification, showNotification, hideNotification } = useNotification();

  const handleSubmit = async (data: BookUpdateDto) => {
    if (!isbn) return;

    try {
      await bookService.updateBook(isbn, data);
      showNotification('Book updated successfully', 'success');
      setTimeout(() => navigate(`/books/${isbn}`), 1000);
    } catch (err) {
      const apiError = handleApiError(err);
      showNotification(apiError.message, 'error');
      throw err;
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
      <h1 className="mb-4">Edit Book</h1>
      <div className="card">
        <div className="card-body">
          <BookForm 
            initialData={book}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/books/${isbn}`)}
            isEditMode={true}
          />
        </div>
      </div>
      {notification && (
        <Notification notification={notification} onDismiss={hideNotification} />
      )}
    </div>
  );
}
