const Author = require("../models/Author");

const login = async (req, res) => {
    try {
        const author = await Author.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await author.generateAuthToken();

        res.status(200).send(token);
    } catch (e) {
        console.log('an error encountered');
        res.status(400).send(e);
    }
};

const signup = async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).send({ message: "Author created successfully", author });
    }
    catch (e) {
        res.status(400).send(e);
    }
};

const updateCredentials = async (req, res) => {
    try {
        const updates = Object.keys(req.body);

        const allowed = ["name", "email", "password", "phoneno"];
        const isValid = updates.every((update) =>
            allowed.includes(update)
        );

        if (!isValid) {
            return res.status(400).send({ error: "Invalid operation!" });
        }

        const author = await Author.findById(req.author._id);

        updates.forEach((update) => (author[update] = req.body[update]));
        await author.save();

        res.send({ message: "Updated successfully" });
    } catch (e) {
        console.log('an error encountered');
        res.status(400).send(e);
    }
};

const logout = async (req, res) => {
    try {
        req.author.tokens = req.author.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.author.save();
        res.send({ message: "Logged out successfully" });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
};

module.exports = { login, updateCredentials, logout, signup };