import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getToken } from "next-auth/jwt";
import connectDB from "../../db/connection";
import UserSchema from '../../schema/User';
import userResolver from '../../services/user.resolver';

const context = async ({ req, res }) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        throw new Error('Unauthorized');
    }
    return { token, user: token.user };
};
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
await connectDB();
const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, UserSchema],
    resolvers: [resolvers, userResolver],
});
// https://discuss.python.org/t/video-generation-with-python/47250
//https://blog.designly.biz/a-complete-guide-to-authentication-in-next-js-14
//https://levelup.gitconnected.com/how-to-add-jwt-authentication-to-nextjs-apps-a0dc83bd257d
const getHandler = startServerAndCreateNextHandler(apolloServer, {
    context: async req => await getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
    // context: async ({ req, res }) => {
    //     console.log(req);
    //     // const token = await getToken({ req, sec_key })
    //     // console.log("JSON Web Token", sec_key, await getToken({ req, sec_key }));
    //     return {
    //         // token: await getToken({ req, sec_key }),
    //         userId: 123,
    //         // db: ,
    //     }
    // },

});

export const GET = getHandler;
export const POST = getHandler;
export const PUT = getHandler;
export const DELETE = getHandler;