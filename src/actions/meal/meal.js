"use server";

import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function addMealAndBecomeManager(payload) {
  const { mealName, packageType, createdDate, expiryDate, email, name } = payload;

  if (!mealName || !packageType || !createdDate || !expiryDate || !email || !name) {
    throw new Error("Missing required fields");
  }

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);
  const usersCollection = await mongodbConnect(collectionNames.usersCollection);

  const newMeal = {
    mealName,
    packageType,
    createdDate: new Date(createdDate),
    expiryDate: new Date(expiryDate),
    createdByEmail: email,
    createdAt: new Date(),
    members: [
      {
        email,
        name,
        role: "manager",
        joinedAt: new Date(),
      },
    ],
  };

  // Insert meal with default member
  await mealsCollection.insertOne(newMeal);

  // Update user role to manager
  await usersCollection.updateOne(
    { email },
    { $set: { role: "manager" } }
  );

  return { message: "Meal created successfully and user promoted to manager." };
}