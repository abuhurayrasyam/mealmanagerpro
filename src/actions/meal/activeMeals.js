// actions/mealActions.js
"use server";

import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function getMealByEmail(email) {
  if (!email) throw new Error("Email is required");

  const mealsCollection = await mongodbConnect(collectionNames.mealsCollection);
  const meal = await mealsCollection.findOne({ "members.email": email });

  if (!meal) throw new Error("Meal not found");

  return JSON.parse(JSON.stringify(meal)); // serialize for React
}
