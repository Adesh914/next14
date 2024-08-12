import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import cors from 'cors';

//import { typeDefs } from './schema';
//import { resolvers } from './resolvers';
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
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,

});
const corsOptions = {
    origin: '*',
    credentials: true,
};

// apolloServer.applyMiddleware({
//     app: cors(corsOptions),
//     path: '/api',
// });
/* const handler = startServerAndCreateNextHandler(apolloServer, {
    // context: async (req) => ({ req }),
}); */
const handler = startServerAndCreateNextHandler(apolloServer, {
    context: async (req) => ({ req }),
});

// export { handler as GET, handler as POST };
// export { handler as GET, handler as POST, handler as PUT, handler as DELETE };


export { handler as default };
