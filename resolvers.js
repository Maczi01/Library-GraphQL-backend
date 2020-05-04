const resolvers = {
    Query: {
        books: (rootValue, args, {db}) => db.getAllBooks(),
        authors: (rootValue, args, {db}) => db.getAllAuthors(),
        users: (rootValue, args, {db}) => db.getAllUsers(),
        book: (rootValue, {id}, {db}) => db.getBookById(id),
        user: (rootValue, {id}, {db}) => db.getUserById(id),
        author: (rootValue, {id}, {db}) => db.getAuthorById(id),
        randomUser: (rootValue, args, {db}) => db.getRandomUser(),
        randomBook: (rootValue, args, {db}) => db.getRandomBook(),
        randomAuthor: (rootValue, args, {db}) => db.getRandomAuthor(),
    },
    Book: {
        author: (book, args, {db}) => db.getAuthorById(book.authorId),
        cover: book => ({
            path: book.coverPath
        })
    },
    Author: {
        books: (author, args, {db}) => author.bookIds.map(db.getBookById),
        photo: author => ({
            path: author.photoPath
        })
    },
    Avatar: {
        image: avatar => ({
            path: avatar.imagePath
        })
    },
    Image: {
        url: (image, args, {baseAssetsUrl}) => baseAssetsUrl + image.path
    }
};

module.exports = resolvers;
