const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

require("dotenv").config();


const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email");
            }
        },
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        
    },

    phoneNo: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },

    likedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],

    tokens: [
        {
            token: {
                type: String,
                required: false,
            },
        },
    ],

    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
});

authorSchema.methods.generateAuthToken = async function () {
    const author = this;

    const token = jwt.sign(
        { _id: author._id.toString() },
        process.env.JWT_SECRET
    );

    author.tokens = author.tokens.concat({ token });
    await author.save();

    return token;
};

authorSchema.methods.toJSON = function () {
    const author = this;
    const authorObject = author.toObject();

    delete authorObject.password;
    delete authorObject.tokens;

    return authorObject;
};

authorSchema.statics.findByCredentials = async function (email, password) {
    const author = await Author.findOne({ email });

    if (!author) {
        throw new Error("User not found");
    }

    const isMatched = await bcrypt.compare(password, author.password);

    if (!isMatched) {
        throw new Error("Invalid Password");
    }

    return author;
};

authorSchema.pre("save", async function (next) {
    const author = this;

    if (author.isModified("password")) {
        author.password = await bcrypt.hash(author.password, 8);
    }

    next();
});

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
