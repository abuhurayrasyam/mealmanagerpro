import { signInUser } from "@/actions/auth/signInUser";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {

    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await signInUser(credentials);

                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: "/signin"
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }