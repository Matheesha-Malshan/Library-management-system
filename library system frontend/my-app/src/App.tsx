import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { BooksPage } from './pages/BooksPage';
import { CreateBookPage } from './pages/CreateBookPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { EditBookPage } from './pages/EditBookPage';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/new" element={<CreateBookPage />} />
        <Route path="/books/:isbn" element={<BookDetailPage />} />
        <Route path="/books/:isbn/edit" element={<EditBookPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
