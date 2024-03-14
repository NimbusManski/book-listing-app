import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditBook() {
  const [book, setBook] = useState({
    title: "",
    description: "",
    price: "",
    cover: "",
  });
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const bookId = location.pathname.split("/")[2];

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/books/${bookId}`
        );
        setBook(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchBookDetails();
  }, [bookId]);

  async function UpdateBookHandler(e) {
    e.preventDefault();

    if (!book.title || !book.description || !book.price) {
      alert("Please fill in all fields");
      return;
    } else if (book.description.length > 999) {
      alert("Description exceeds 999 character max");
      return;
    } else if (book.title.length > 255) {
      alert("Title exeeds 255 character max");
      return;
    }

    const data = new FormData();
    data.set("title", book.title);
    data.set("description", book.description);
    data.set("price", book.price);

    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    const response = await axios.put(
      `${process.env.SERVER}/books/${bookId}`,
      data
    );

    if (response.status === 200) {
      setRedirect(true);
    } else if (response.status === 401) {
      alert("Session has expired");
      navigate("/login");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="form-container">
      <form className="form">
        <h1>Edit Book</h1>
        <input
          type="text"
          value={book.title}
          placeholder="Title"
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          name="title"
        ></input>
        <textarea
          type="text"
          rows={9}
          value={book.description}
          placeholder="Add a description"
          onChange={(e) => setBook({ ...book, description: e.target.value })}
          name="description"
        ></textarea>
        <input
          type="number"
          value={book.price}
          placeholder="price"
          onChange={(e) => setBook({ ...book, price: e.target.value })}
          name="price"
        ></input>
        <input
          className="cover-input"
          type="file"
          placeholder="cover"
          onChange={(e) => setFiles(e.target.files)}
          name="cover"
        ></input>
        <button onClick={UpdateBookHandler}>Update book</button>
      </form>
    </div>
  );
}
