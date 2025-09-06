"use server";

import { ObjectId } from "mongodb";
import mongodbConnect, { collectionNames } from "@/lib/mongodb";

// CHANGE MANAGER ROLE
export async function changeManagerRole({ mealId, newManagerEmail }) {
  if (!mealId || !newManagerEmail) {
    throw new Error("Meal ID and new manager email are required");
  }

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);
  const usersCollection = await mongodbConnect(collectionNames.usersCollection);

  const meal = await mealsCollection.findOne({ _id: new ObjectId(mealId) });
  if (!meal) throw new Error("Meal not found");

  const currentManager = meal.members.find((m) => m.role === "manager");
  if (!currentManager) throw new Error("Current manager not found");

  if (currentManager.email === newManagerEmail) {
    throw new Error("User is already the manager");
  }

  const updatedMembers = meal.members.map((member) => {
    if (member.email === newManagerEmail) return { ...member, role: "manager" };
    if (member.email === currentManager.email) return { ...member, role: "user" };
    return member;
  });

  const updateMealResult = await mealsCollection.updateOne(
    { _id: new ObjectId(mealId) },
    { $set: { members: updatedMembers } }
  );

  if (updateMealResult.modifiedCount === 0) {
    throw new Error("Failed to update manager role in meal");
  }

  const updateNewManagerUser = usersCollection.updateOne(
    { email: newManagerEmail },
    { $set: { role: "manager" } }
  );

  const updateOldManagerUser = usersCollection.updateOne(
    { email: currentManager.email },
    { $set: { role: "user" } }
  );

  const [newManagerResult, oldManagerResult] = await Promise.all([
    updateNewManagerUser,
    updateOldManagerUser,
  ]);

  if (newManagerResult.modifiedCount === 0 || oldManagerResult.modifiedCount === 0) {
    throw new Error("Failed to update manager/user roles");
  }

  return { message: "Manager role updated successfully" };
}

// REMOVE MEMBER FROM MEAL
export async function removeMemberFromMeal({ mealId, memberEmail }) {
  if (!mealId || !memberEmail) {
    throw new Error("Meal ID and member email are required");
  }

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);
  const usersCollection = await mongodbConnect(collectionNames.usersCollection);

  const meal = await mealsCollection.findOne({ _id: new ObjectId(mealId) });
  if (!meal) throw new Error("Meal not found");

  const member = meal.members.find((m) => m.email === memberEmail);
  if (!member) throw new Error("Member not found in this meal");

  if (member.role === "manager") {
    throw new Error("Cannot remove the current manager. Please assign a new manager first.");
  }

  const updatedMembers = meal.members.filter((m) => m.email !== memberEmail);

  const updateMeal = await mealsCollection.updateOne(
    { _id: new ObjectId(mealId) },
    { $set: { members: updatedMembers } }
  );

  if (updateMeal.modifiedCount === 0) {
    throw new Error("Failed to remove member from meal");
  }

  // Optional: Also update user role if needed
  await usersCollection.updateOne(
    { email: memberEmail },
    { $set: { role: "user" } }
  );

  return { message: "Member removed successfully from the meal" };
}
