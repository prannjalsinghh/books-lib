const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author",
    },

    likes: {
        type: Number,
        default: 0,
        required: true,
    },

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;