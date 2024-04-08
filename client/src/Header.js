import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        // if (isLoggedIn) {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profile`, {
            withCredentials: true,
          });
  
          if (response.status === 200) {
            setUserInfo(response.data);
            console.log(response.data);
            setIsLoggedIn(true);
          }
        // }
      } catch (err) {
        console.log(err);
        if (err.response.status === 401 && !isLoggedIn) {
          navigate("/login");
        }
        if (err.response.status === 401 && isLoggedIn) {
          alert("Session has expired");
          setIsLoggedIn(false);
          navigate("/login");
        }
      }
    }

    console.log(isLoggedIn);
  
    fetchUserData();
  }, [isLoggedIn, userInfo]);

  async function logoutHandler() {
    try{
const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        withCredentials: true,
      })
        if (response.status === 200) {
          setIsLoggedIn(false);
          console.log(isLoggedIn);
          setUserInfo(null);
          navigate("/login");
          console.log(isLoggedIn, userInfo)
        }
    } catch(err) {
      console.log(err);
    }
  }

  async function deleteAcctHandler() {
    try {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (shouldDelete) {
        const response = await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/profile/${userInfo.id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsLoggedIn(false);
          navigate("/login");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header>
      <Link to="/" className="logo">
        CRUD's Book Store
      </Link>
      <nav>
        {isLoggedIn && (
          <>
            <span className="username">Logged in as {userInfo.username}</span>
            <div>
              <Link className="new-book-link" to={"/create"}>
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
              <a className="logout" href="#" onClick={logoutHandler}>
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
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Logout
              </a>
              <a className="delete" href="#" onClick={deleteAcctHandler}>
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete account
              </a>
            </div>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
