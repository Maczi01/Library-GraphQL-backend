const decodeBase64 = base64String =>
    Buffer.from(base64String, "base64").toString();
const encodeBase64 = rawString => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = externalId => decodeBase64(externalId).split("-", 2);
const toDbId = externalId => toTypeAndDbId(externalId)[1];

const getAnythingByExternalID = (externalId, db) => {
    const [type, dbId] = toTypeAndDbId(externalId);

    switch (type) {
        case "Book": {
            return db.getBookById(dbId);
        }
        case "Author": {
            return db.getAuthorById(dbId);
        }
        case "User": {
            return db.getUserById(dbId);
        }
        case "BookCopy": {
            return db.getBookCopyById(dbId);
        }
        default:
            return null;
    }
};

const getEverything = (db) => (
    [...db.getAllBooks(), ...db.getAllAuthors(), ...db.getAllUsers(), ...db.getAllBookCopies()]
)

const resolvers = {
        Query: {
            books: (rootValue, {searchQuery}, {db, search}) =>
                searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
            authors: (rootValue, {searchQuery}, {db, search}) =>
                searchQuery.length > 0 ? search.findAuthors(searchQuery) : db.getAllAuthors(),
            users: (rootValue, {searchQuery}, {db, search}) =>
                searchQuery.length > 0 ? search.findUsers(searchQuery) : db.getAllUsers(),
            book: (rootValue, {id}, {db}) => db.getBookById(toDbId(id)),
            user: (rootValue, {id}, {db}) => db.getUserById(toDbId(id)),
            author: (rootValue, {id}, {db}) => db.getAuthorById(toDbId(id)),
            anything: (rootValue, {id}, {db}) => getAnythingByExternalID(id, db),
            randomUser: (rootValue, args, {db}) => db.getRandomUser(),
            randomBook: (rootValue, args, {db}) => db.getRandomBook(),
            randomAuthor: (rootValue, args, {db}) => db.getRandomAuthor(),
            everything: (rootValue, args, {db}) => getEverything(db)
        },
        Book: {
            id: book => toExternalId(book.id, "Book"),
            author:
                (book, args, {db}) => db.getAuthorById(book.authorId),
            cover:
                book => ({
                    path: book.coverPath
                }),
            copies:  (book, args, {db}) => db.getBookCopiesByBookId(book.id),

        }
        ,
        Author: {
            id: author => toExternalId(author.id, "Author"),
            books:
                (author, args, {db}) => author.bookIds.map(db.getBookById),
            photo:
                author => ({
                    path: author.photoPath
                })
        },
        User: {
            id: user => toExternalId(user.id, "User"),
            ownedBookCopies: (user, args, {db}) => db.getBorrowedBookCopiesByUserId(user.id),
            borrowedBookCopies: (user, args, {db}) => db.getOwnedBookCopiesByUserId(user.id),
        },
        BookCopy: {
            id: bookCopy => toExternalId(bookCopy.id, "BookCopy"),
            owner: (bookCopy, args, {db}) => db.getUserById(bookCopy.ownerId),
            book: (bookCopy, args, {db}) => db.getBookById(bookCopy.bookId),
            borrower: (bookCopy, args, {db}) => bookCopy.borrowerId && db.getUserById(bookCopy.borrowerId),
        }
        ,
        Avatar: {
            image: avatar => ({
                path: avatar.imagePath
            })
        }
        ,
        Image: {
            url: (image, args, {baseAssetsUrl}) => baseAssetsUrl + image.path
        },
        Anything: {
            __resolveType: (anything) => {
                if (anything.ownerId) {
                    return "BookCopy";
                }
                if (anything.title) {
                    return "Book";
                }
                if (anything.bio) {
                    return "Author";
                }
                if (anything.info) {
                    return "User";
                }
                return null;
            }
        }
    }
;

module.exports = resolvers;
