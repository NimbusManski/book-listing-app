import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function addBookHandler(e) {
    e.preventDefault();

    if (!title || !description || !price || !files[0]) {
      alert("Please fill in all fields and upload a cover image");
      return;
    } else if (description.length > 255) {
      alert("Description exceeds 255 character max");
      return;
    } else if (title.length > 45) {
      alert("Title exeeds 45 character max");
      return;
    }

    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    data.set("price", price);
    data.set("file", files[0]);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    console.log(files);

    const response = await fetch("http://localhost:8080/books", {
      method: "POST",
      body: data,
    });

    console.log(await response.json);

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="form-container">
      <form className="form">
        <h1 className="add-book-h1">Add Book</h1>
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
