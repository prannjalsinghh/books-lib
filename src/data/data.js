const { faker } = require("@faker-js/faker");

const Author = require("../models/Author");
const Book = require("../models/Book");

async function createDummyData() {

    try {
        for (let i = 0; i < 10; i++) {
            const name = faker.name.fullName();
            const password = '12345678';
            const email = faker.internet.email();
            const phoneNo = faker.phone.number("9#########");

            const author = new Author({
                name,
                password,
                email,
                phoneNo,
            });

            const num = Math.floor(Math.random() * 20) + 1;

            for (let j = 0; j < num; j++) {
                const bookName = faker.lorem.words(3);
                const likes = faker.datatype.number({ min: 1, max: 100 });

                const book = new Book({
                    title: bookName,
                    likes,
                    author: author._id,
                });

                await book.save();
                author.books.push(book._id);
                await author.save();
            }
        }
    } catch (err) {
        console.log('error occurred');
    }
};

module.exports = createDummyData;