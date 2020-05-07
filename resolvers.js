const toDatabaseID = externalID => Buffer.from(externalID, "base64").toString();
const toExternalID = databaseID => Buffer.from(databaseID).toString("base64");

const resolvers = {
    Query: {
        books: (rootValue, {searchQuery}, {db, search}) =>
            searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
        authors: (rootValue, args, {db}) => db.getAllAuthors(),
        users: (rootValue, args, {db}) => db.getAllUsers(),
        book: (rootValue, {id}, {db}) => db.getBookById(toDatabaseID(id)),
        user: (rootValue, {id}, {db}) => db.getUserById(toDatabaseID(id)),
        author: (rootValue, {id}, {db}) => db.getAuthorById(toDatabaseID(id)),
        randomUser: (rootValue, args, {db}) => db.getRandomUser(),
        randomBook: (rootValue, args, {db}) => db.getRandomBook(),
        randomAuthor: (rootValue, args, {db}) => db.getRandomAuthor(),
    },
    Book: {
        id: book => toExternalID(book.id),
        author: (book, args, {db}) => db.getAuthorById(book.authorId),
        cover: book => ({
            path: book.coverPath
        })
    },
    Author: {
        id: author => toExternalID(author.id),
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
    },
    User: {
        id: user => toExternalID(user.id),
    }
};

module.exports = resolvers;
