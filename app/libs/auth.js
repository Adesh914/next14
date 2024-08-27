import connectDB from "@/db/connection";
import UserService from "../../services/user.service";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
            credentials: {
                // email: { label: "Email", type: "text", placeholder: "jsmith" },
                // password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const { email, password } = credentials;
                const userFound = await service.getOne(email);

                if (!userFound) {
                    throw new Error("Invalid Email ddd");
                }
                const passwordMatch = await bcrypt.compare(password, userFound.password);
                if (!passwordMatch) throw new Error("Invalid password");

                return userFound;
            },
            pages: {
                signIn: "/",
            },
            session: {
                strategy: 'jwt'
            },
            callback: {
                async jwt({ token, user, session, trigger }) {
                    console.log("credentials:", user)
                    if (trigger === "update" && session?.name) {
                        token.name = session.name;
                    }

                    if (trigger === "update" && session?.email) {
                        token.email = session.email;
                    }
                    if (user) {
                        const u = user;
                        return {
                            ...token,
                            id: u.id,
                            // phone: u.phone,
                        };
                    }
                    return token;
                },
                async session({ session, token }) {
                    return {
                        ...session,
                        user: {
                            ...session.user,
                            _id: token.id,
                            // name: token.name,
                            // phone: token.phone,
                        }
                    };
                }
            }
        }),

    ],
    // https://www.blackbox.ai/chat/JNLx0Uz
    // Configure JWT settings
    jwt: {
        secret: process.env.JWT_SECRET,
        encryption: true,
        maxAge: 60 * 60, // 1 hour
    },
    // Configure session settings
    session: {
        strategy: 'jwt',
    }
}