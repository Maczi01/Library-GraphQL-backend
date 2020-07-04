var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'lib'
    }
});

const getAllAuthors = async () => await knex.select('name', 'bio', 'resourceType').from('author');
const getAllBooks = async () => await knex.select('title', 'description', 'resourceType').from('book');
const getAllUsers = async () => await knex.select('name', 'info', 'resourceType').from('user');

const getAuthorById = async (authorId) => await knex.select('name', 'bio', 'resourceType').from('author').where('id', authorId);


function getAllResourcesByType(resourceType) {
    return [...findAllResourcesByType(resourceType)];
}


const getBookById = id => getResourceByIdAndType(id, "Book");

// const getAuthorById = id => getResourceByIdAndType(id, "Author");

// const getBooksByAuthorId = getAllBooks().filter(book => book.authorId === authorId);

const getUserById = id => getResourceByIdAndType(id, "User");

const getBookCopyById = id => getResourceByIdAndType(id, "BookCopy");
const getAllBookCopies = () => getAllResourcesByType("BookCopy");


const getBookCopiesByBookId = bookId => getAllBookCopies().filter(bookCopy => bookCopy.bookId === bookId);

const getBorrowedBookCopiesByUserId = (userId) => getAllBookCopies().filter(bookCopy => bookCopy.borrowerId === userId);
const getOwnedBookCopiesByUserId = (userId) => getAllBookCopies().filter(bookCopy => bookCopy.ownerId === userId);


const getRandomIntBook = () => {
    const min = 1;
    const max = data.books.length;
    return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomIntUser = () => {
    const min = 1;
    const max = data.users.length;
    return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomIntAuthor = () => {
    const min = 1;
    const max = data.authors.length;
    return Math.floor(Math.random() * (max - min)) + min;
}
const getRandomBook = () => data.books[getRandomIntBook()];
const getRandomUser = () => data.users[getRandomIntUser()];
const getRandomAuthor = () => data.authors[getRandomIntAuthor()];

const borrowBookCopy = (bookCopyId, borrowerId) => {
    const bookCopy = findResourceByIdAndType(bookCopyId, "BookCopy")
    if (!!bookCopy.borrowerId) {
        throw new Error("Book already borrowed");
    }
    if (bookCopy.ownerId === borrowerId) {
        throw new Error("Its your book! You cant borrow it!")
    }
    updateBookCopy(bookCopyId, {
        ...bookCopy,
        borrowerId
    })
};

const returnBookCopy = (bookCopyId, borrowerId) => {
    const bookCopy = findResourceByIdAndType(bookCopyId, "BookCopy")
    if (!bookCopy.borrowerId) {
        throw new Error("Book wasn't borrowed");
    }
    if (bookCopy.borrowerId !== borrowerId) {
        throw new Error("You dont borrow this book")
    }
    updateBookCopy(bookCopyId, {
        ...bookCopy,
        borrowerId: null
    })
};

const borrowRandom = (borrowerId) => {
    const AvailableBookCopies = getAvailableBookCopies();
    const randomBook = pickRandom(AvailableBookCopies);
    if (randomBook != null) {
        randomBook.borrowerId = borrowerId;
        return randomBook;
    } else {
        return null;
    }
};

const getAvailableBookCopies = () => (
    data.bookCopies.filter(bookCopy => bookCopy.borrowerId === null)
);

const deleteResource = (id, resourceType) => {
    const resources = findAllResourcesByType(resourceType);
    const index = resources.findIndex(resource => resource.id = id);
    if (index < 0) {
        throw new Error(`Unrecognized resource type ${resourceType}`)
    }
    resources.splice(index, 1)
};


const pickRandom = (array) => {
    if (array.length) {
        const randomNumber = () => {
            const min = 1;
            const max = array.length;
            return Math.floor(Math.random() * (max - min)) + min;
        };
        const rand = randomNumber();
        return array[rand]
    } else {
        return null
    }
};

const deleteAuthor = (id) => {
    getBooksByAuthorId(id).forEach(book => deleteBook(book.id))
    deleteResource(id, "Author");
};

const deleteBookCopy = (id) => {
    deleteResource(id, "BookCopy")
};

const deleteBook = (id) => {
    getBookCopiesByBookId(id).forEach(bookCopy => deleteBookCopy(bookCopy.id));
    deleteResource(id, "Book");
};

const deleteUser = (id) => {
    getBorrowedBookCopiesByUserId(id).forEach(bookCopy => returnBookCopy(bookCopy.id, id));
    getOwnedBookCopiesByUserId(id).forEach(bookCopy => deleteBookCopy(bookCopy.id));
    deleteResource(id, "User");
};


const updateBookCopy = (id, bookCopyData) => {
    const {ownerId, bookId, borrowerId} = bookCopyData;
    if (!getUserById(ownerId)) {
        throw new Error(`BookCopy needs valid owner id ! ${ownerId} `)
    }
    if (!getBookById(bookId)) {
        throw new Error(`BookCopy needs valid owner id ! ${bookId} `)
    }
    if (borrowerId && !getUserById(borrowerId)) {
        throw new Error(`BookCopy needs validempty or borrower id ! ${ownerId} `)
    }
    updateResource(id, "BookCopy", {ownerId, bookId, borrowerId})
};

const updateUser = (id, userData) => {
    const {name, info} = userData;
    if (!name || name.length < 1) {
        throw new Error("User must have a name!")
    }
    if (!info || info.length < 1) {
        throw new Error("User must have a info!")
    }
    updateResource(id, "User", {name, info})
};

const updateBook = (id, bookData) => {
    const {authorId, title, description} = bookData;
    if (!getAuthorById(authorId)) {
        throw new Error(`Author needs valid  id ! ${authorId} `)
    }
    updateResource(id, "User", {authorId, title, description})
};

const updateAuthor = (id, authorData) => {
    const {name, photoPath, bio} = authorData;
    if (!getAuthorById(authorId)) {
        throw new Error(`Author needs valid  id ! ${authorId} `)
    }
    updateResource(id, "Author", {name, photoPath, bio})
};

const updateResource = (id, resourceType, resourceData) => {
    const resources = findAllResourcesByType(resourceType);
    const index = resources.findIndex(resource => resource.id = id);
    if (index < 0) {
        throw new Error(`Unrecognized resource type ${resourceType}`)
    }
    const existingResource = resources[index];
    resources[index] = {
        id,
        resourceType,
        ...existingResource,
        ...resourceData,
    }
};

const createResource = (resourceType, resourceData) => {
    const id = generateNextID(resourceType)
    const resources = findAllResourcesByType(resourceType);
    const createdResource = {
        ...resourceData,
        resourceType,
        id,
    };

    resources.push(createdResource);
    return createdResource
};

function initializeNextID(resourceType) {
    const resources = findAllResourcesByType(resourceType)
    if (!resources.nextId) {
        resources.nextId = resources.nextId + 1
    }
}

function generateNextID(resourceType) {
    const resources = findAllResourcesByType(resourceType);
    return `${resources.nextId++}`
}


const VALID_AVATAR_COLORS = ["red", "green", "yellow", "blue"]

const createBookCopy = (bookCopyData) => {
    const {ownerId, bookId, borrowerId} = bookCopyData;
    if (!getUserById(ownerId)) {
        throw new Error(`BookCopy needs valid owner id ! ${ownerId} `)
    }
    if (!getBookById(bookId)) {
        throw new Error(`BookCopy needs valid owner id ! ${bookId} `)
    }
    if (borrowerId && !getUserById(borrowerId)) {
        throw new Error(`BookCopy needs validempty or borrower id ! ${ownerId} `)
    }
    return createResource('BookCopy', {ownerId, bookId, borrowerId});
}


const PHOTO_PATHS = [
    "/images/book-authors/j-k-rowling.jpg",
    "/images/book-authors/james-s-a-corey.jpg",
    "/images/book-authors/andrzej-sapkowski.jpg"
]

const createAuthor = (authorData) => {
    const {name, bio} = authorData;
    if (!name || name.length < 1) {
        throw new Error("Author must have a title!")
    }
    if (!bio || bio.length < 1) {
        throw new Error("Author must have a bio!")
    }
    const photoPath = PHOTO_PATHS[Math.floor(Math.random() * PHOTO_PATHS.length)]
    return createResource("Author", {name, photoPath, bio, photoPath})
}

const createBook = (bookData) => {
    const {authorId, title, description} = bookData;
    if (!title || title.length < 1) {
        throw new Error("Book must have a title!")
    }
    if (!description || description.length < 1) {
        throw new Error("Book must have a description!")
    }
    if (!getAuthorById(authorId)) {
        throw new Error(`Author needs valid  id ! ${authorId} `)
    }
    return createResource('Book', {authorId, title, description});
}

const createUser = (userData) => {
    const {name, email, info,} = userData
    if (!name || name.length < 1) {
        throw new Error("User needs valid name!")
    }
    if (!email || !email.match(/@/)) {
        throw new Error("User needs valid name!")
    }
    if (!info || info.length < 1) {
        throw new Error("User needs valid info!")
    }
    const color = VALID_AVATAR_COLORS[Math.floor(Math.random() * VALID_AVATAR_COLORS.length)]
    const avatarName = `${Math.random() > 0 ? "m" : "w"}${Math.ceil(Math.random * 25)}`
    return createResource("User", {
        name,
        email,
        info,
        avatar: {
            imagePath: `/images/avatars/${avatarName}.png`,
            color
        }
    });
}

const db = {
    getAllAuthors,
    getAllBooks,
    getAllUsers,
    getAuthorById,
    // getBooksByAuthorId,
    // getBookById,
    // getUserById,
    // getRandomBook,
    // getRandomUser,
    // getRandomAuthor,
    // getAllBookCopies,
    // getBookCopyById,
    // getBookCopiesByBookId,
    // getBorrowedBookCopiesByUserId,
    // getOwnedBookCopiesByUserId,
    // updateBookCopy,
    // updateUser,
    // updateBook,
    // updateAuthor,
    // borrowBookCopy,
    // returnBookCopy,
    // borrowRandom,
    // getResourceByIdAndType,
    // createUser,
    // createBookCopy,
    // createBook,
    // createAuthor,
    // deleteBookCopy,
    // deleteUser,
    // deleteAuthor,
    // deleteBook
};

module.exports = db;
