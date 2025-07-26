"use server";
import bcrypt from "bcrypt"
import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export const signInUser = async (payload) => {
    const { email, password } = payload;

    const usersCollection = mongodbConnect(collectionNames.usersCollection);
    const user = await usersCollection.findOne({ email })

    if (!user) return null

    const isPasswordOK = await bcrypt.compare(password, user.password)
    if (!isPasswordOK) return null

    await usersCollection.updateOne(
        { email },
        { $set: { lastLoginAt: new Date() } }
    );

    return user;
}