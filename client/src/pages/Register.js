require("dotenv").config();
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function registerUser(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert("Registration successful! You can now login");
        setRedirect(true);
      }
    } catch (err) {
      console.log(err);

      if (err.response.status === 409) {
        alert("User already exists. Please choose a different name");
      }
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={registerUser}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button>Create account</button>
      </form>
      <footer>
        <Link to={"/login"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          Back
        </Link>
      </footer>
    </div>
  );
}

export default Register;
