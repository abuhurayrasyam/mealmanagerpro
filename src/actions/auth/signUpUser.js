"use server";
import bcrypt from "bcrypt";
import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export const signUpUser = async (payload) => {
    const usersCollection = mongodbConnect(collectionNames.usersCollection);

    const { name, email, password } = payload;
    if ( !name || !email || !password ) return null;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        name,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        lastLoginAt: new Date()
    };

    const result = await usersCollection.insertOne(user);
    result.insertedId = result.insertedId.toString();
    return result;
}