import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateBook() {
// const [book, setBook] = useState({
//   title: '',
//   description: '',
//   price: null,
//   cover: null
// });

// const navigate = useNavigate();
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [files, setFiles] = useState('');
const [redirect, setRedirect] = useState(false);

async function addBookHandler(e) {
  e.preventDefault();
const data = new FormData();
data.set('title', title);
data.set('description', description);
data.set('price', price);
data.set('file', files[0]);
console.log(files)


const response = await fetch('http://localhost:8080/books', {
  method: 'POST',
  body: data
}) 

console.log(await response.json);

if (response.ok) {
 setRedirect(true);
}

}; 


// async function addBookHandler(e) {
//   e.preventDefault();
//   try {
//     await axios.post('http://localhost:8080/books', book);
//       navigate('/');
//   } catch (err) {
//     console.log(err)
//   }
  
// };

//  console.log(book)
if(redirect) {
  return <Navigate to={'/'} />
}

  return (
    <form className='form'>
    <h1>Add Book</h1>
      <input type='text' value={title} placeholder='title' onChange={e => setTitle(e.target.value)} name='title'></input>
      <input type='text' value={description} placeholder='description' onChange={e => setDescription(e.target.value)} name='description'></input>
      <input type='number' value={price} placeholder='price' onChange={e => setPrice(e.target.value)} name='price'></input>
      <input className='cover-input' type='file' placeholder='cover' onChange={e => setFiles(e.target.files)} name='cover'></input>
      <button onClick={addBookHandler}>Add book</button>
    </form>
  )
}
