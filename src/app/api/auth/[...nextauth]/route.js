import { signInUser } from "@/actions/auth/signInUser";
import mongodbConnect, { collectionNames } from "@/lib/mongodb";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: "/signin"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account) {
            const { providerAccountId, provider } = account;
            const { email: user_email, image, name } = user;

            const userCollection = mongodbConnect(collectionNames.usersCollection);
            const existingUser = await userCollection.findOne({ providerAccountId });

            const now = new Date();

            if (!existingUser) {
                const payload = {
                    name,
                    email: user_email,
                    providerAccountId,
                    provider,
                    image,
                    role: "user",
                    createdAt: now,
                    lastLoginAt: now,
                };
                await userCollection.insertOne(payload);
            } else {
                await userCollection.updateOne(
                { providerAccountId },
                { $set: { lastLoginAt: now } }
                );
            }
            }
            return true;
        },
    },

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }