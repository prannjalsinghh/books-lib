const express = require('express')
const app = express();
require('./src/db');
const createDummyData = require('./src/data/data')
const authenticateRoute = require("./src/routes/authentication");
const authorsRoute = require("./src/routes/author");
const booksRouter = require("./src/routes/books");

app.use(express.json());

createDummyData();

app.use("/api/books", booksRouter);
app.use("/api/authors", authorsRoute);
app.use("/api", authenticateRoute);

app.get("*", (req, res) => {
    res.status(404).send({ message: "Page doesn't exist" });
});

module.exports = app;