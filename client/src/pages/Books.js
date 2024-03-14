import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(`https://book-listing-app-api.onrender.com/books`);
        setBooks(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div>
      <Header />
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.cover && (
                <img src={`https://book-listing-app-api.onrender.com/${book.cover}`} alt="" />
              )}
              <h2>{book.title}</h2>
              <p>{book.description}</p>
              <span className="price">{`$${Number(book.price).toFixed(
                2
              )}`}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
