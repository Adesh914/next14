import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import logger from "./logger";
import Schema from "@/schema/User";
// import connectDB from "@/db/connection";
import gql from "graphql-tag";

// connectDB();

const typeDefs = gql`
      type Query {
        hello: String
      }
    `;

const resolvers = {
    Query: {
        hello: () => 'Hello, World!',
    },
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    logging: true,
    listen: {
        port: 4000,
        host: 'localhost',
    },
});

const { url } = startStandaloneServer(server, {

    // context: async ({ req }) => {
    //     const token = getTokenFromRequest(req);
    //     const { cache } = server;
    //     return { token, dataSources: { moviesAPI: new MoviesAPI({ cache, token }) } };
    // },
});
console.log(`Server ready at ${url}`);
