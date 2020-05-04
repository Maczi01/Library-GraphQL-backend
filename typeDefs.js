const {gql} = require("apollo-server");
const typeDefs = gql`
    schema {
        query: Query
    }
    type Query {
        authors: [Author!]!
        books: [Book!]!
        users: [User!]!
        randomBook: Book!
        randomUser: User!
        randomAuthor: Author!
        book(id: Int!): Book
        author(id: Int!): Author
        user(id: Int!): User
    }
    type Author {
        id: Int!
        name: String!
        photo: Image!
        bio: String!
        books: [Book!]!
    }
    type Book {
        id: Int!
        title: String!
        cover: Image!
        author: Author!
        description: String!
    }
    type User {
        id: Int!
        name: String!
        email: String!
        avatar: Avatar!
        info: String!
    }
    type Image {
        url: String!
    }
    type Avatar {
        image: Image!
        color: String!
    }
`;

module.exports = typeDefs;
