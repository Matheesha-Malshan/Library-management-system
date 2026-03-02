import { useState, type FormEvent } from 'react';
import type { Book, BookCreateDto, BookUpdateDto, ValidationErrors } from '../types/book.types';
import { validateBookForm, toDateTimeLocal } from '../utils/validation';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: BookCreateDto | BookUpdateDto) => Promise<void>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function BookForm({ initialData, onSubmit, onCancel, isEditMode = false }: BookFormProps) {
  const [formData, setFormData] = useState({
    isbn: initialData?.isbn || '',
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    publishDate: initialData?.publishDate ? toDateTimeLocal(initialData.publishDate) : '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateBookForm(formData, isEditMode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const { isbn, title, author, description, publishDate } = formData;
        void isbn;
        await onSubmit({
          title,
          author,
          description,
          publishDate: new Date(publishDate).toISOString(),
        });
      } else {
        await onSubmit({
          ...formData,
          publishDate: new Date(formData.publishDate).toISOString(),
        });
      }
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="isbn" className="form-label">ISBN *</label>
        <input
          type="text"
          className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          disabled={isEditMode}
        />
        {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="author" className="form-label">Author *</label>
        <input
          type="text"
          className={`form-control ${errors.author ? 'is-invalid' : ''}`}
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        {errors.author && <div className="invalid-feedback">{errors.author}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="publishDate" className="form-label">Publish Date *</label>
        <input
          type="datetime-local"
          className={`form-control ${errors.publishDate ? 'is-invalid' : ''}`}
          id="publishDate"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
        />
        {errors.publishDate && <div className="invalid-feedback">{errors.publishDate}</div>}
      </div>

      <div className="d-flex gap-2">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}
