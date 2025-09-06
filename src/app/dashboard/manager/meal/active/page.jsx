// app/dashboard/manager/meal/active/page.jsx


import ActiveMealClient from "./ActiveMealClient";

import { getMealByEmail } from "@/actions/meal/activeMeals";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export default async function ActiveMealPage() {
  // Get logged-in user session on the server
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Please log in to view your meal.</p>;
  }

  let meal = null;
  try {
    meal = await getMealByEmail(session.user.email);
  } catch (error) {
    return <p>{error.message}</p>;
  }

  // Pass meal data to client component
  return <ActiveMealClient meal={meal} />;
}
