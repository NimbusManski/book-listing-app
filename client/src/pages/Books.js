import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import { UserContext } from "../UserContext";

export default function Books() {
  const [books, setBooks] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    async function fetchBooks() {
      try {
        if(userInfo) {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/books`);
        setBooks(response.data);
        console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div>
     <Header />
      {userInfo && (
        <>
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.cover && (
                <img src={`${process.env.REACT_APP_SERVER_URL}/${book.cover}`} alt="" />
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
        </>
      )}
      
    </div>
  );
}
