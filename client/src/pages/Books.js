import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Books() {
const [books, setBooks] = useState([]);

useEffect(() => {
async function fetchBooks() {
  try {
    const res = await axios.get('http://localhost:8080/books');
    setBooks(res.data);
  } catch (err) {
    console.log(err)
  }
 } 
 fetchBooks();
}, [])

async function deleteHandler(id) {
  await axios.delete('http://localhost:8080/books/' + id);
  window.location.reload();
}

  return (
    <div>
      <h1>Books</h1>
      <div className='books'>
        {books.map(book => (
          <div className='book' key={book.id}>
            {book.cover && <img src={`http://localhost:8080/` + book.cover} alt='' />}
            <h2>{book.title}</h2>
            <p>{book.description}</p>
            <span>{`$${book.price}`}</span>
            <button className='delete' onClick={() => {deleteHandler(book.id)}}>Delete</button>
            <button className='update'><Link to={`/update/${book.id}`}>Update</Link></button>
          </div>
        ))}
      </div>
        <button><Link to={'/create'}>Add new book</Link></button>
    </div>
    
  )
}
