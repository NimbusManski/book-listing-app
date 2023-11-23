import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateBook() {
const [book, setBook] = useState({
  title: '',
  description: '',
  price: null,
  cover: ''
});

const navigate = useNavigate();
const location = useLocation();

const bookId = location.pathname.split("/")[2];

function handleInput(e) {
 setBook((prev) => ({...prev, [e.target.name]: e.target.value}));

}; 

async function updateBookHandler(e) {
  e.preventDefault();
  try {
    await axios.put('http://localhost:8080/books/' + bookId, book);
      navigate('/');
  } catch (err) {
    console.log(err)
  }
  
};

 console.log(book)
  return (
    <div className='form'>
    <h1>Update Book</h1>
      <input type='text' placeholder='title' onChange={handleInput} name='title'></input>
      <input type='text' placeholder='description' onChange={handleInput} name='description'></input>
      <input type='number' placeholder='price' onChange={handleInput} name='price'></input>
      <input type='text' placeholder='cover' onChange={handleInput} name='cover'></input>
      <button onClick={updateBookHandler}>Update book</button>
    </div>
  )
}
