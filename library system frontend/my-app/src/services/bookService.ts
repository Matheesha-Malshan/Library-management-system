import axios, { AxiosError } from 'axios';
import type { Book, BookCreateDto, BookUpdateDto, ApiError } from '../types/book.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  async getAllBooks(): Promise<Book[]> {
    const response = await apiClient.get<Book[]>('/api/Books');
    return response.data;
  },

  async getBookByIsbn(isbn: string): Promise<Book> {
    const response = await apiClient.get<Book>(`/api/Books/${isbn}`);
    return response.data;
  },

  async createBook(book: BookCreateDto): Promise<void> {
    await apiClient.post('/api/Books/create-book', book);
  },

  async updateBook(isbn: string, book: BookUpdateDto): Promise<void> {
    await apiClient.put(`/api/Books/${isbn}`, book);
  },

  async deleteBook(isbn: string): Promise<void> {
    await apiClient.delete(`/api/Books/${isbn}`);
  },
};

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your connection.',
      };
    }
    
    const status = axiosError.response.status;
    
    if (status === 404) {
      return {
        message: 'Book not found.',
        status: 404,
      };
    }
    
    if (status >= 400 && status < 500) {
      const responseData = axiosError.response?.data as { message?: string } | undefined;
      return {
        message: responseData?.message || 'Invalid request.',
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
