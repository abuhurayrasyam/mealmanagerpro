"use server";

import { ObjectId } from "mongodb";
import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function addMemberToMeal({ email, mealId, role = "user", name }) {
  if (!email || !mealId) {
    throw new Error("Email and Meal ID are required");
  }

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);

  // Check if the user is already a member
  const existingMemberCheck = await mealsCollection.findOne({
    _id: new ObjectId(mealId),
    "members.email": email,
  });

  if (existingMemberCheck) {
    throw new Error("User is already a member of this meal");
  }

  const joinedAt = new Date().toISOString();

  // Add the member to the members array
  const updateResult = await mealsCollection.updateOne(
    { _id: new ObjectId(mealId) },
    {
      $push: {
        members: {
          email,
          name: name || "", // optional, can be empty string if not provided
          role,
          joinedAt,
        },
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("Failed to add member");
  }

  // Return the new member object for instant UI update
  return {
    email,
    name: name || "",
    role,
    joinedAt,
  };
}
