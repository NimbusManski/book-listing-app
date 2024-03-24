import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Books from "./pages/Books";
import EditBook from "./pages/EditBook";
import CreateBook from "./pages/CreateBook";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetails from "./pages/BookDetails";
import { UserContextProvider } from "./UserContext";
import { useEffect } from "react";

function App() {
useEffect(() => {
  const test = async () => {
    const res = await fetck('https://book-listing-app-api.onrender.com/AlotOfArgonians/test') 
      console.log(res);
    
  }
})


  return (
    <div>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Books />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/create"} element={<CreateBook />} />
            <Route path={"/edit/:id"} element={<EditBook />} />
            <Route path={"/books/:id"} element={<BookDetails />} />
            <Route path="*" element={<Books />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
