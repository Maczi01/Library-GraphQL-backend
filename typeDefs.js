const {gql} = require("apollo-server");
const typeDefs = gql`
    schema {
        query: Query
    }
    type Query {
        authors: [Author!]!
        books(searchQuery: String! = ""): [Book!]!
        users: [User!]!
        randomBook: Book!
        randomUser: User!
        randomAuthor: Author!
        book(id: ID!): Book
        author(id: ID!): Author
        user(id: ID!): User
    }
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
    }
    type User {
        id: ID!
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
