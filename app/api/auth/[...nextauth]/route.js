import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connection";
import bcrypt from "bcrypt";
import UserService from "@/services/user.service";
import { jwt } from "jsonwebtoken";
const service = new UserService();
// https://canopas.com/next-js-how-to-validate-forms-on-the-server-side-using-zod
//https://tighten.com/insights/form-validation-with-type-inference-made-easy-with-zod-the-best-sidekick-for-typescript/#:~:text=Zod%20shines%20with%20TypeScript%20because,type%20safety%20even%20without%20TypeScript.
// https://lyonwj.com/blog/grandstack-podcast-app-next-js-graphql-authentication

// Helper function to refresh JWT token
async function refreshJwtToken(token) {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Refresh the token
    const newToken = jwt.sign(decoded, process.env.SECRET_KEY, {
        expiresIn: '1h',
    });

    return newToken;
}
export const authOptions = {
    session: {
        strategy: 'jwt',

        // jwt: true,
        // maxAge: 30 * 24 * 60 * 60, // 30 days
        // maxAge: 1 * 60 * 60, // 1 hrs
    },
    // Enable JSON Web Tokens
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 1 * 1 * 15 * 60, // 15 minutes
    },
    refresh: 15 * 60, // 15 minutes
    // jwt: async ({ token, user, account, profile, isNewUser }) => {

    //     // Refresh token logic here
    //     if (token.exp < Date.now() / 1000) {
    //         // Token has expired, refresh it
    //         const newToken = await refreshJwtToken(token);
    //         return newToken;
    //     }

    //     return token;
    // },

    providers: [
        CredentialsProvider({
            // name: "Credentials",
            // credentials: {
            //     // email: { label: "Email", type: "text", placeholder: "jsmith" },
            //     // password: { label: "Password", type: "password" },
            // },
            async authorize(credentials) {
                await connectDB();
                const { email, password } = credentials;
                const userFound = await service.getOne(email);

                if (!userFound) {
                    throw new Error("Invalid Email ddd");
                }
                const passwordMatch = await bcrypt.compare(password, userFound.password);
                if (!passwordMatch) throw new Error("Invalid password");
                const { _id, first_name, last_name } = userFound;
                return { id: _id, name: first_name + " " + last_name, email, picture: false, isAllowedToSignIn: true };
            },

        }),

    ],
    pages: {
        signIn: '/',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    // Define the jwt callback function
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("account:-", account, "user:-", user)
            // const isAllowedToSignIn = true
            if (user.isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        },
        // async signIn({ user, account, profile, email, credentials }) {
        //     return true
        // },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken
            session.user.id = token.id
            console.log("session:", token);
            return session
        },

        // async session(session, token) {
        //     if (token) {
        //         session.user = token.user
        //         session.accessToken = token.accessToken
        //         session.error = token.error
        //     }
        //     console.log("session:", session)
        //     return session
        // },
        async jwt({ token, user, account, profile, isNewUser }) {
            // console.log("jwt Token:", token, user, account, isNewUser);
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.accessToken,
                    accessTokenExpires: Date.now() + account.expires_in * 1000,
                    refreshToken: account.refresh_token,
                    user,
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token)
        }

    },
    // Configure JWT settings

    // Configure session settings

    secret: process.env.NEXTAUTH_SECRET
}


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


