class Search {
    constructor(db) {
        this.db = db
    }

    findBooks(searchQuery) {
        const foundIds = ["1", "2"]
        return foundIds.map(this.db.getBookById)
    }
}

module.exports = {
    Search
}
