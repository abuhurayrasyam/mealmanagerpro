"use server";

import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function getUserProfile(email) {
  if (!email) throw new Error("User email is required");

  const usersCollection = await mongodbConnect(collectionNames.usersCollection);

  const user = await usersCollection.findOne({ email });

  if (!user) throw new Error("User not found");

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: new Date(user.createdAt).toISOString(),
    lastLoginAt: new Date(user.lastLoginAt).toISOString(),
    image: user.image || null,
  };
}
