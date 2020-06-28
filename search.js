const lunr = require("lunr");


function initBooks(db) {
    return lunr(function () {
        this.ref('id')
        this.field('title')
        this.field('description')
        db.getAllBooks().forEach((book) => {
            this.add(book)
        }, this)
    })
}

function initAuthors(db) {
    return lunr(function () {
        this.ref('id')
        this.field('name')
        this.field('bio')
        db.getAllAuthors().forEach((author) => {
            this.add(author)
        }, this)
    })
}

// function initUser(db) {
//     return lunr(function () {
//         this.ref('id')
//         this.field('name')
//         this.field('info')
//         db.getAllUsers().forEach((user) => {
//             this.add(user)
//         }, this)
//     })
// }


class Search {
    constructor(db) {
        this.db = db
        this.usersIndex = initUser(this.db);
        this.booksIndex = initBooks(this.db);
        this.authorsIndex = initAuthors(this.db)
    }

    findBooks(searchQuery) {
        const results = this.booksIndex.search(searchQuery)
        const foundsId = results.map(res => res.ref);
        return foundsId.map(this.db.getBookById);
    }

    findUsers(searchQuery) {
        const results = this.usersIndex.search(searchQuery)
        const foundsId = results.map(res => res.ref);
        return foundsId.map(this.db.getUserById);
    }

    findAuthors(searchQuery) {
        const results = this.authorsIndex.search(searchQuery)
        const foundsId = results.map(res => res.ref);
        return foundsId.map(this.db.getAuthorById);
    }
}

module.exports = {
    Search
}
