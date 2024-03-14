import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function CreateBook() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`${process.env.SERVER}/profile`, {
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
    fetchUserData();
  }, [setUserInfo, navigate]);

  async function addBookHandler(e) {
    try {
      e.preventDefault();

      if (!title || !description || !price || !files[0]) {
        alert("Please fill in all fields and upload a cover image");
        return;
      } else if (description.length > 999) {
        alert("Description exceeds 999 character max");
        return;
      } else if (title.length > 255) {
        alert("Title exceeds 255 character max");
        return;
      }

      const data = new FormData();
      data.set("user_id", userInfo.id);
      data.set("title", title);
      data.set("description", description);
      data.set("price", price);
      data.set("file", files[0]);

      const response = await axios.post(`${process.env.SERVER}/books`, data);

      if ((response.status = 200)) {
        setRedirect(true);
      }
    } catch (err) {
      if (err.response.status === 401) {
        alert("Session has expired");
        navigate("/login");
      }
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="form-container">
      <form className="form">
        <h1>Add Book</h1>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          name="title"
        ></input>
        <textarea
          type="text"
          rows={9}
          value={description}
          placeholder="Add a description"
          onChange={(e) => setDescription(e.target.value)}
          name="description"
        ></textarea>
        <input
          type="number"
          value={price}
          placeholder="price"
          onChange={(e) => setPrice(e.target.value)}
          name="price"
        ></input>
        <input
          className="cover-input"
          type="file"
          placeholder="cover"
          onChange={(e) => setFiles(e.target.files)}
          name="cover"
        ></input>
        <button onClick={addBookHandler}>Add book</button>
      </form>
    </div>
  );
}
