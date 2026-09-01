const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 

let books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear' },
  { id: 2, title: 'Deep Work', author: 'Cal Newport' }
];


app.get('/books/search', (req, res) => {
  const author = req.query.author;

  if (!author) {
    return res.status(400).send('Please add ?author= to your search');
  }

  const results = books.filter(b =>
    b.author.toLowerCase().includes(author.toLowerCase())
  );

  res.json(results);
});

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

app.post('/books', (req, res) => {
  const title = req.body.title;
  const author = req.body.author;

  if (!title || !author) {
    return res.status(400).send('Title and author are required');
  }

  const newBook = {
    id: books.length + 1,
    title: title,
    author: author
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).send('Book not found');

  book.title = req.body.title;
  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  books = books.filter(b => b.id != req.params.id);
  res.send('Book deleted');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
