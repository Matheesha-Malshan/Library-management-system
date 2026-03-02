import type { BookCreateDto, ValidationErrors } from '../types/book.types';

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
    const date = new Date(data.publishDate);
    if (isNaN(date.getTime())) {
      errors.publishDate = 'Invalid date format';
    }
  }
  
  return errors;
}

export function toDateTimeLocal(isoString: string): string {
  if (!isoString) return '';
  return isoString.slice(0, 16);
}

export function toISOString(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString();
}
