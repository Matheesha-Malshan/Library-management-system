export interface Book {
  isbn: string;
  title: string;
  author: string;
  description: string;
  publishDate: string;
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
