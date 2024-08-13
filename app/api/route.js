import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import connectDB from "../../db/connection";
import UserSchema from '../../schema/User';
import userResolver from '../../services/user.resolver';


import gql from 'graphql-tag';
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
// await connectDB();
const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, UserSchema],
    resolvers: [resolvers, userResolver],
});

const getHandler = startServerAndCreateNextHandler(apolloServer, {
    // context: async ({ req }) => {
    //     // console.log(req);
    //     return {
    //         userId: 123,
    //         db: await connectDB(),
    //     }
    // },
});

export const GET = getHandler;
export const POST = getHandler;
export const PUT = getHandler;
export const DELETE = getHandler;