const express = require('express');
const booksRouter = new express.Router();

const auth = require('../auth');
const { getAllBooks, likeBook, unlikeBook, getBooks } = require('../controllers/books');

booksRouter.get('/', auth, getBooks);
booksRouter.get('/all', auth, getAllBooks);
booksRouter.put('/like/:id', auth, likeBook);
booksRouter.put('/unlike/:id', auth, unlikeBook);

module.exports = booksRouter;