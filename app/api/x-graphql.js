import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextApiRequest, NextApiResponse } from 'next';
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
        hello: () => 'Hello, ADESH!',
    },
};


const server = new ApolloServer({
    typeDefs: [Schema.typeDefs],
    resolvers: [Schema.resolvers],
    // logging: true
});


export default async function handler(req, res) {
    const { method, url } = req;
    const { graphqlHandler } = server;
    console.log("Method:", method)
    if (method === 'GET' && url === '/api/graphql') {
        return graphqlHandler(req, res);
    }

    if (method === 'POST' && url === '/api/graphql') {
        return graphqlHandler(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
