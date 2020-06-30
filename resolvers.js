const decodeBase64 = base64String =>
    Buffer.from(base64String, "base64").toString();
const encodeBase64 = rawString => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = externalId => decodeBase64(externalId).split("-", 2);
const toDbId = externalId => toTypeAndDbId(externalId)[1];
const id = resource => toExternalId(resource.id, resource.resourceType);
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

const getResourceByExternalId = (externalId, db) => {
    const [type, dbId] = toTypeAndDbId(externalId);
    return db.getResourceByIdAndType(type, dbId);
}

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
            everything: (rootValue, args, {db}) => getEverything(db),
            resources: (rootValue, args, {db}) => getEverything(db),
            resource: (rootValue, {id}, {db}) => getAnythingByExternalID(id, db),
            people: (rootValue, {id}, {db}) => [...db.getAllAuthors(), ...db.getAllUsers()]
        },
        Mutation: {
            borrowBookCopy: (rootValue, {id}, {db, currentUserDbId}) => {
                db.borrowBookCopy(toDbId(id), currentUserDbId);
                return db.getBookCopyById(toDbId(id));
            },
            returnBookCopy: (rootValue, {id}, {db, currentUserDbId}) => {
                db.returnBookCopy(toDbId(id), currentUserDbId);
                return db.getBookCopyById(toDbId(id));
            },
            borrowRandomBook: (rootValue, {id}, {db, currentUserDbId}) => {
                return db.borrowRandom(currentUserDbId)
            },
            createUser: (rootValue, {name, info, email}, {db}) => {
                return db.createUser({name, info, email});
            },
            updateUser: (rootValue, {id, name, info}, {db}) => {
                db.updateUser(toDbId(id), {name, info})
                return db.getUserById(toDbId(id))
            },
            deleteUser: (rootValue, {id}, {db}) => {
                db.deleteUser(toDbId(id))
                return id;
            },
            createAuthor: (rootValue, {name, bio}, {db}) => {
                return db.createAuthor({name, bio});
            },
            updateAuthor: (rootValue, {id, name, bio}, {db}) => {
                db.updateAuthor(toDbId(id), {name, bio})
                return db.getAuthorById(toDbId(id))
            },
            deleteAuthor: (rootValue, {id}, {db}) => {
                db.deleteAuthor(toDbId(id))
                return id;
            },
            createBook: (rootValue, {title, description}, {db}) => {
                return db.createBook({title, description});
            },
            updateBook: (rootValue, {id, title, description}, {db}) => {
                db.updateBook(toDbId(id), {name, bio})
                return db.getBookById(toDbId(id))
            },
            deleteBook: (rootValue, {id}, {db}) => {
                db.deleteBook(toDbId(id))
                return id;
            },
            createBookCopy: (rootValue, {ownerId, bookId, borrowerId}, {db}) => {
                return db.createBookCopy({
                    ownerId: toDbId(ownerId),
                    bookId: toDbId(bookId),
                    borrowerId: toDbId(borrowerId)
                });
            },
            updateBookCopy: (rootValue, {id, ownerId, bookId, borrowerId}, {db}) => {
                db.updateBook(toDbId(id), {ownerId: toDbId(ownerId), bookId, borrowerId: toDbId(borrowerId)})
                return db.getBookCopyById(toDbId(id))
            },
            deleteBookCopy: (rootValue, {id}, {db}) => {
                db.deleteBookCopy(toDbId(id))
                return id;
            }
        },
        Book: {
            id,
            author:
                (book, args, {db}) => db.getAuthorById(book.authorId),
            cover:
                book => ({
                    path: book.coverPath
                }),
            copies: (book, args, {db}) => db.getBookCopiesByBookId(book.id),
        }
        ,
        Author: {
            id,
            books:
                (author, args, {db}) => db.getBooksByAuthorId(author.id),

            photo:
                author => ({
                    path: author.photoPath
                })
        },
        User: {
            id,
            ownedBookCopies: (user, args, {db}) => db.getOwnedBookCopiesByUserId(user.id),
            borrowedBookCopies: (user, args, {db}) => db.getBorrowedBookCopiesByUserId(user.id),
        },
        BookCopy: {
            id,
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
        },
        Resource: {
            __resolveType: resource => resource.resourceType
        },
        Person: {
            __resolveType: resource => resource.resourceType
        }
    }
;

module.exports = resolvers;
