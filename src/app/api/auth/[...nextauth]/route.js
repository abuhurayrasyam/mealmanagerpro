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
        
        // Add this to attach role to token on sign in
        async jwt({ token, user }) {
            if (user) {
            // On initial sign in, get user from DB and add role to token
            const userCollection = mongodbConnect(collectionNames.usersCollection);
            const dbUser = await userCollection.findOne({ email: user.email });
            if (dbUser) {
                token.role = dbUser.role || "user";
            }
            }
            return token;
        },

        // Add this to expose role on session object
        async session({ session, token }) {
            session.user.role = token.role || "user";
            return session;
        },
    },

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }