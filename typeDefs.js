const {gql} = require("apollo-server");
const typeDefs = gql`
    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        authors(searchQuery: String! = ""): [Author!]!
        books(searchQuery: String! = ""): [Book!]!
        users(searchQuery: String! = ""): [User!]!
        randomBook: Book!
        randomUser: User!
        randomAuthor: Author!
        book(id: ID!): Book
        author(id: ID!): Author
        user(id: ID!): User
        anything(id: ID!): Anything @deprecated(reason: "No longer supported. Use resource instead")
        everything: [Anything!]! @deprecated(reason: "No longer supported. Use resources instead")
        resources: [Resource!]!
        resource(id: ID!): Resource!
        people: [Person!]!
    }
    type Mutation {
        borrowBookCopy(id: ID!): BookCopy!
        returnBookCopy(id: ID!): BookCopy!
        borrowRandomBook: BookCopy

        createUser(name: String!, email: String!, info: String!): User
        updateUser(id: ID!, name: String!,  info: String!): User
        deleteUser(id: ID!): ID

        createAuthor(name: String!, bio: String!): Author
        updateAuthor(id: ID!, name: String!,  bio: String!): Author
        deleteAuthor(id: ID!): ID

        createBook(title: String!, description: String!): Book
        updateBook(id: ID!, titile: String!,  description: String!): Book
        deleteBook(id: ID!): ID

        createBookCopy(ownerId: String!, bookId: String!, borrowerId: String ): BookCopy
        updateBookCopy(id: ID!, ownerId: String!, bookId: String!, borrowerId: String ): BookCopy
        deleteBookCopy(id: ID!): ID
    }
    union Anything= User | Author | Book | BookCopy
    interface Resource {
        id: ID!
    }
    interface Person {
        name:String!
    }
    type Author implements Resource & Person{
        id: ID!
        name: String!
        photo: Image!
        bio: String!
        books: [Book!]!
    }
    type Book implements Resource {
        id: ID!
        title: String!
        cover: Image!
        author: Author!
        description: String!
        copies: [BookCopy!]!
    }
    type User implements Resource & Person{
        id: ID!
        name: String!
        email: String!
        avatar: Avatar!
        info: String!
        ownedBookCopies: [BookCopy!]!
        borrowedBookCopies: [BookCopy!]!
    }
    type Image {
        url: String!
    }
    type Avatar {
        image: Image!
        color: String!
    }
    type BookCopy   implements Resource{
        id: ID!
        owner: User!
        book: Book!
        borrower: User
    }
`;

module.exports = typeDefs;
