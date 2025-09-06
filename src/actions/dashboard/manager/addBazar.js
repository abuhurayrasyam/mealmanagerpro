"use server";

import mongodbConnect, { collectionNames } from "@/lib/mongodb";

export async function addBazar(payload) {
  const { date, amount, details, email } = payload;

  const db = await mongodbConnect(collectionNames.bazarsCollection);
  await db.insertOne({ date, amount, details, email, createdAt: new Date() });

  return { message: "Bazar added successfully" };
}
