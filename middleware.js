
import { withAuth, getNextSession } from "next-auth/middleware";
// import { AuthOptions } from "./pages/api/auth/[...nextauth]";
import { NextResponse } from "next/server";


export default withAuth(


    // jwt: { decode: authOptions.jwt },
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {

        // console.log('pathName:', req.nextUrl.pathname)
        // const { pathname } = req.nextUrl;
        // let cookie = req.cookies.get('nextjs')?.value
        // // console.log(cookie) // => 'fast'
        // const allCookies = req.cookies.getAll()
        // console.log(allCookies)
        // console.log('req.nextauth.token ', req.nextauth.token)


        console.log("req.nextauth.token", req.nextauth.token)


        return NextResponse.next();
    },
    // {
    //     callbacks: {
    //         authorized: ({ token }) => token?.role === "admin",
    //     },
    // },


)

export const config = { matcher: ["/admin"] }

// https://reacthustle.com/blog/nextjs-setup-role-based-authentication
// https://www.mongodb.com/developer/products/atlas/crud-operations-with-graphql//

//https://nextjs.org/docs/advanced-features/middleware


// https://nextjs.org/docs/pages/building-your-application/authentication#authentication