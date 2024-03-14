import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function loginUser(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `$${process.env.REACT_APP_SERVER_URL}/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (err) {
      if (err.response.status === 401) {
        alert("Invalid username or password");
      }
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={loginUser}>
        <h1>Login</h1>
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
        <button>Login</button>
        Don't have an account? <Link to={"/register"}>Register here</Link>
      </form>
    </div>
  );
}

export default Login;
