import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogoutHandler() {
  const navigate = useNavigate();

  async function logoutHandler() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // Perform any additional cleanup or state updates if needed
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
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
  );
}

export default LogoutHandler;