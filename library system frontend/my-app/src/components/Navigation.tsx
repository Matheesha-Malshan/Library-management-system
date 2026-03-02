import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/books">Book Library</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/books">Books</Link>
          <Link className="nav-link" to="/books/new">Add Book</Link>
        </div>
      </div>
    </nav>
  );
}
