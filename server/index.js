const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'))

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'WaterBlackCube79',
  database: 'books'
});

app.get('/', (req, res) => {
  res.json('Backend running');
})

app.get('/books', (req,res) => {
  const q = 'SELECT * FROM books';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
});

app.post('/books', uploadMiddleware.single('file'), (req, res) => {
  q = 'INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)';
   const {originalname, path} = req.file;


  const parts = originalname.split('.');
  const ext = parts[parts.length - 1]
  const newPath = path + '.' + ext
  fs.renameSync(path, newPath);

  // res.json({ext})
  
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    newPath
  ];

  console.log('asdf');

 

db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('book created successfully');
  })
});

app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const q = 'DELETE FROM books WHERE id = ?';

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json('book deleted successfully');
  })
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const q = 'UPDATE books SET `title` = ?, `description` = ?, `price` = ?, `cover` = ? WHERE id = ?';

  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json('book updated successfully');
  })
});

app.listen(8080, (req, res) => {
  console.log('server running on port 8080');
});