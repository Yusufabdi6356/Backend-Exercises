const mongoose = require('mongoose');
const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid book id');
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send(err.message);
    }
    res.status(500).send('Server error');
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid book id');
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    res.json(updatedBook);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).send(err.message);
    }
    res.status(500).send('Server error');
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid book id');
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send('Book not found');
    }
    res.send(`Book with id ${id} deleted`);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
