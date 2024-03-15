import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const BookDetails = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/profile`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      }
    }

    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/books/${id}`);
        setBook(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
    fetchBookDetails();
  }, [id, userInfo.id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  async function deleteHandler(id) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (shouldDelete) {
      await axios.delete(`/books/${id}`);
      navigate("/");
    }
  }

  return (
    <div className="detailed-book">
      <div>
        {book.cover && (
          <img src={`/${book.cover}`} alt="" />
        )}
      </div>

      <div>
        <h2>{book.title}</h2>
        <p>{book.description}</p>
        <span className="price">{`$${Number(book.price).toFixed(2)}`}</span>
      </div>
      <div>
        {book.user_id === userInfo.id && (
          <>
            <button className="edit-btn">
              <Link to={`/edit/${book.id}`}>Edit</Link>
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteHandler(book.id)}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
