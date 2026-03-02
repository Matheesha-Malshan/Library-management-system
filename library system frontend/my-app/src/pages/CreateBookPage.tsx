import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { BookForm } from '../components/BookForm';
import { Notification } from '../components/Notification';
import { bookService, handleApiError } from '../services/bookService';
import type { BookCreateDto, BookUpdateDto } from '../types/book.types';

export function CreateBookPage() {
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  const handleSubmit = async (data: BookCreateDto | BookUpdateDto) => {
    try {
      await bookService.createBook(data as BookCreateDto);
      showNotification('Book created successfully', 'success');
      setTimeout(() => navigate('/books'), 1000);
    } catch (err) {
      const apiError = handleApiError(err);
      showNotification(apiError.message, 'error');
      throw err;
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Add New Book</h1>
      <div className="card">
        <div className="card-body">
          <BookForm onSubmit={handleSubmit} onCancel={() => navigate('/books')} />
        </div>
      </div>
      {notification && (
        <Notification notification={notification} onDismiss={hideNotification} />
      )}
    </div>
  );
}
