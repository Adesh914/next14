import connectDB from "@/db/connection";
import UserService from "../../services/user.service";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// https://stackademic.com/blog/authentication-in-next-js-14-using-nextauth
// https://www.petermekhaeil.com/til/zod-validate-file/#:~:text=You%20can%20use%20Zod's,instanceof(File)%20.
// https://www.goflexoffices.com/
// https://realsta.com/
// https://melrose-homes.com/
const service = new UserService();
export const authOptions = {
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
                return { id: _id, name: first_name + " " + last_name, email, picture: false };
            },

        }),

    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    // Define the jwt callback function
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        // async session({ session, user, token }) {
        //     return session
        // },
        /* async jwt({ token, user, account, profile, isNewUser }) {
            // console.log("jwt Token:", token, user, account, isNewUser);
            // Add custom claims to the token
            token.accessToken = account.accessToken;
            // token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            return token
        }, */
    },
    // https://www.blackbox.ai/chat/JNLx0Uz
    // Configure JWT settings
    /* jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true,
        maxAge: 60 * 60, // 1 hour
        async encode(params) {

        },
        async decode() {

        }
    },
    // Configure session settings
    session: {
        strategy: 'jwt',
        maxAge: 3 * 60 * 60, // 3 hrs  (day * hrs(24) * minutes * seconds)
    }, */

    secret: process.env.NEXTAUTH_SECRET,
}