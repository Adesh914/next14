import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
const httpLink = createHttpLink({
    uri: "http://localhost:5002/api"
});
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    headers: {
        mode: "no-cors",
        "Access-Control-Allow-Origin": "*",
    },
});
export default client;
// export function ClientProvider({ children }) {
//     let client = null;
//     if (!client || typeof window === "undefined") {
//         const client = new ApolloClient({
//             uri: "http://localhost:5002/api",
//             cache: new InMemoryCache(),
//             headers: {
//                 mode: "no-cors",
//                 "Access-Control-Allow-Origin": "*",
//             },
//         });
//     }
//     return (<ApolloProvider client={client}>{children}</ApolloProvider>)
// }