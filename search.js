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


class Search {
    constructor(db) {
        this.db = db
        this.booksIndex = initBooks(this.db)
    }

    findBooks(searchQuery) {
        const results = this.booksIndex.search(searchQuery)
        const foundsId = results.map(res => res.ref);
        return foundsId.map(this.db.getBookById);
    }
}

module.exports = {
    Search
}
