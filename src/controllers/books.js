const Book = require("../models/Book");
const Author = require("../models/Author");

const getAllBooks = async (req, res) => {
    try {
        const books =  await Book.find().populate({
            path: "author",
            select: { name: 1, _id: 1, likes: 1 },
        });

        if (req.query.sortbylikes == "desc") {
            books.sort((a, b) => b.likes - a.likes);
        } else if (req.query.sortbylikes == "asc") {
            books.sort((a, b) => a.likes - b.likes);
        }

        const page = req.query.page || 1;
        const perPage = 10;
        const start = (page - 1) * perPage;
        const end = page * perPage;

        const modifiedBooks = books.slice(start, end);

        res.status(200).send(modifiedBooks);
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
};

const getBooks = async (req, res) => {
    try {
        const authors = await Author.find({});
        const arr = [];

        for (let idx = 0; idx < authors.length; idx++) {
            await authors[idx].populate("books", { _id: 1, __v: 0 });

            const authorBooks = authors[idx].books;

            for (let curr = 0; curr < authorBooks.length; curr++) {
                await authorBooks[curr].populate({
                    path: "author",
                    select: { name: 1, _id: 0 },
                });
            }
            arr.push(...authorBooks);
        }

        if (req.query.sortbylikes == "desc") {
            arr.sort((a, b) => b.likes - a.likes);
        } else if (req.query.sortbylikes == "asc") {
            arr.sort((a, b) => a.likes - b.likes);
        }

        const page = req.query.page || 1;
        const perPage = 10;
        const start = (page - 1) * perPage;
        const end = page * perPage;

        const books = arr.slice(start, end);

        res.status(200).send(books);
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
};

const likeBook = async (req, res) => {
    try {
        const author = await Author.findOne({_id:req.body.authorId})
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        book.likes++;

        console.log(author);

        if (author.likedBooks.includes(book._id)) {
            return res.status(400).send("You already liked this book");
        }

        author.likedBooks.push(book._id);
        await book.save();
        await author.save();

        res.status(200).send(book);
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
};

const unlikeBook = async (req, res) => {
    try {
        const author = await Author.findOne({_id:req.body.authorId})
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        const index = author.likedBooks.indexOf(book._id);

        if (index === -1) {
            return res.status(400).send("You have not liked this book");
        }

        author.likedBooks.splice(index, 1);
        book.likes--;
        await book.save();
        await author.save();

        res.status(200).send(book);
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
};

module.exports = { getBooks, likeBook, unlikeBook, getAllBooks };