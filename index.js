const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const db = require("./db");

const PORT = process.env.PORT || 4000;
const BASE_ASSESTS_URL = process.env.BASE_ASSETS_URL || "http://examples.devmastery.pl/assets";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:{
        db,
        baseAssetsUrl: BASE_ASSESTS_URL,
    },
    introspection: true,
    playground: true,
});

server.listen({port: PORT}).then(({url}) => {
    console.log(`Server works! url: ${url}`);
});
