const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  BookID: { type: Number, required: true },
  Title: { type: String, required: true },
  Author: { type: String, required: true },
  Year: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
