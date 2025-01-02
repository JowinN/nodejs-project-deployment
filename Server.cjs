const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Book = require("./model.cjs");
const app = express();

app.use(express.json());

// Connect to MongoDB
const MONGO_URL =
  "mongodb+srv://jowinnadar7:2TTowSnskDV96XHP@cluster0.1lbdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace 'mydatabase' with your actual database name

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Serve static files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// API routes
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Error in fetching the Books");
    res.status(500).json({ message: "Error" });
  }
});

app.get("/books/:BookID", async (req, res) => {
  try {
    const bookId = parseInt(req.params.BookID);
    const book = await Book.findOne({ BookID: bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error("Error in fetching the Book:", err);
    res.status(500).json({ message: "Error fetching the book" });
  }
});

app.post("/insert", (req, res) => {
  const newBook = new Book({
    BookID: req.body.BookID,
    Title: req.body.Title,
    Author: req.body.Author,
    Year: req.body.Year,
  });

  newBook
    .save()
    .then(() => {
      res.send("Book Inserted Successfully");
    })
    .catch((err) => {
      console.log("Error in inserting Book");
    });
});

app.post("/update", (req, res) => {
  Book.findOneAndUpdate({ BookID: req.body.id }, { Title: req.body.Title })
    .then(() => {
      res.send("Updated Successfully");
    })
    .catch((err) => {
      console.log("Error in updating");
    });
});

app.post("/delete/:id", (req, res) => {
  const ID = req.params.id;
  Book.findOneAndDelete({ BookID: ID })
    .then(() => {
      res.send("Book Deleted Successfully");
    })
    .catch((err) => {
      console.log("Error in Deleting");
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
