// import NextAuth from "next-auth/next";

import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connection";
import userModel from "@/services/user.service";
// https://canopas.com/next-js-how-to-validate-forms-on-the-server-side-using-zod
//https://tighten.com/insights/form-validation-with-type-inference-made-easy-with-zod-the-best-sidekick-for-typescript/#:~:text=Zod%20shines%20with%20TypeScript%20because,type%20safety%20even%20without%20TypeScript.
// https://lyonwj.com/blog/grandstack-podcast-app-next-js-graphql-authentication

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            // id: "credentials",
            // credentials: {
            //     email: { label: "Email", type: "text", placeholder: "jsmith" },
            //     password: { label: "Password", type: "password" },
            // },
            async authorize(credentials) {
                console.log(credentials)
            }
        })
    ]
}



