require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/books', bookRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).send('Invalid JSON body');
  }
  res.status(500).send('Server error');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Connection error:', err));
