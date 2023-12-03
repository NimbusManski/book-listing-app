import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get("http://localhost:8080/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchBooks();
  }, []);

  async function deleteHandler(id) {
    await axios.delete("http://localhost:8080/books/" + id);
    window.location.reload();
  }

  return (
    <div>
      <h1>CRUD's Book Store</h1>
      <button className="new-book-btn">
        <Link to={"/create"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
           
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new book
        </Link>
      </button>
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && (
              <img src={`http://localhost:8080/` + book.cover} alt="" />
            )}
            <h2>{book.title}</h2>
            <p>{book.description}</p>
            <span className="price">{`$${book.price}`}</span>
            <div>
              <button className="edit-btn">
                <Link to={`/edit/${book.id}`}>Edit</Link>
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  deleteHandler(book.id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
