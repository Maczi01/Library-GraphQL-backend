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
        anything(id: ID!): Anything
        everything: [Anything!]!
    }
    type Mutation {
        borrowBookCopy(id: ID!): BookCopy!
    }
    union Anything= User | Author | Book | BookCopy
    type Author {
        id: ID!
        name: String!
        photo: Image!
        bio: String!
        books: [Book!]!
    }
    type Book {
        id: ID!
        title: String!
        cover: Image!
        author: Author!
        description: String!
        copies: [BookCopy!]!
    }
    type User {
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
    type BookCopy {
        id: ID!
        owner: User!
        book: Book!
        borrower: User
    }
`;

module.exports = typeDefs;
