"use server";

import { ObjectId } from "mongodb";
import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function addMemberToMeal({ email, mealId, role = "user" }) {
  if (!email || !mealId) {
    throw new Error("Email and Meal ID are required");
  }

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);
  const usersCollection = await mongodbConnect(collectionNames.usersCollection);

  // Check if the user is already a member
  const existingMemberCheck = await mealsCollection.findOne({
    _id: new ObjectId(mealId),
    "members.email": email,
  });

  if (existingMemberCheck) {
    throw new Error("User is already a member of this meal");
  }

  // Fetch user info to get the name
  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const joinedAt = new Date().toISOString();

  // Add the member to the meal with name from users collection
  const updateResult = await mealsCollection.updateOne(
    { _id: new ObjectId(mealId) },
    {
      $push: {
        members: {
          email,
          name: user.name || "N/A",
          role,
          joinedAt,
        },
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("Failed to add member");
  }

  // Return the new member object for immediate UI update
  return {
    email,
    name: user.name || "N/A",
    role,
    joinedAt,
  };
}
