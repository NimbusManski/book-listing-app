require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();

app.use(cors({ credentials: true, origin: 'https://book-listing-app.onrender.com',
methods: ['GET', 'POST', 'PUT', 'DELETE'],
allowedHeaders: ['content-type', 'Authorization'], }));

console.log('Adding CORS support for https://book-listing-app.onrender.com');

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
// app.options('/login', cors());

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


app.get("/", (req, res) => {
  res.json("Backend running");
});

app.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPass = bcrypt.hashSync(password, salt);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    q = "SELECT * FROM bv9bjjshw2vksyyiknwr.users WHERE username = ?";

    db.query(q, [username], (err, data) => {
      if (err) {
        console.error("Error checking if user exists:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (data.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      } else {
        const q =
          "INSERT INTO bv9bjjshw2vksyyiknwr.users (`username`, `password`) VALUES (?, ?)";
        db.query(q, [username, hashedPass], (err, data) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(201).json({ username, hashedPass });
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const q = "SELECT * FROM bv9bjjshw2vksyyiknwr.users WHERE username = ?";

    db.query(q, [username], (err, data) => {
      console.log("Query Error:", err);
      console.log("Query Result:", data);
      if (err) {
        console.log(data);
      }

      if (data.length === 1) {
        const { id, username, password: storedPass } = data[0];
        console.log("Entered password:", password);
        console.log("Stored hashed password:", storedPass);
        const passMatch = bcrypt.compareSync(password, storedPass);
        if (passMatch) {
          jwt.sign(
            {
              id,
              username,
            },
            secret,
            {
              expiresIn: "1h",
            },
            (err, token) => {
              if (err) {
                console.log(err);
              } else {
                res.cookie("token", token, { 
                  secure: true, 
                  sameSite: 'none' 
                }).json({ id, username });
              }
            }
          );
        }
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/profile", (req, res) => {
  try {
    const { token } = req.cookies;

      jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token has expired" });
        } else if (err.name === "JsonWebTokenError") {
          res.status(401).json({ message: "Invalid token" });
        } else {
          res.status(500).json({ message: "Internal server error" });
        }
      } else {
        res.json(info);
      }
    });
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/books", (req, res) => {
  try {
    const q =
      "SELECT books.*, users.username FROM books JOIN users ON books.user_id = users.id ORDER BY books.id DESC";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/books", uploadMiddleware.single("file"), (req, res) => {
  try {
    q =
      "INSERT INTO bv9bjjshw2vksyyiknwr.books (`user_id`, `title`, `description`, `price`, `cover`) VALUES (?)";
    const { originalname, path } = req.file;
    const userId = req.body.user_id;
    console.log(req.body);

    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const values = [
      userId,
      req.body.title,
      req.body.description,
      req.body.price,
      newPath,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      } else {
        return res.json("book created successfully");
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/books/:id", (req, res) => {
  try {
    const bookId = req.params.id;
    const q = "SELECT * FROM bv9bjjshw2vksyyiknwr.books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (!data || data.length === 0)
        return res.status(404).json("Book not found");

      return res.json(data[0]);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/books/:id", (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.body.user_id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId, userId], (err, data) => {
      if (err) return res.json(err);
      return res.json("book deleted successfully");
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/books/:id", uploadMiddleware.single("file"), (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, description, price } = req.body;
    const q =
      "UPDATE bv9bjjshw2vksyyiknwr.books SET `title` = ?, `description` = ?, `price` = ?, `cover` = IFNULL(?, `cover`) WHERE id = ?";

    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const values = [title, description, price, newPath];

    db.query(q, [...values, bookId], (err, data) => {
      if (err) return res.json(err);
      return res.json("book updated successfully");
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/profile/:id", (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Account successfully deleted");  
    });
    
    res.cookie("token", "").json("cookie deleted");

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

app.post("/logout", (req, res) => {
  try {
    return res.status(200);
    // res.cookie("token", "", { expires: new Date(0) }).json("cookie deleted");
  } catch(err) {
    console.error(err);
  }
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Backend running");
});
