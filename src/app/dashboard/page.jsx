"use client";
import { useSession } from "next-auth/react";
import UserProfile from "./components/UserProfile";
import Loading from "@/components/Loading";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading></Loading>;
  if (!session) return <div>Please Sign In</div>;

  return <UserProfile email={session.user.email} />;
}
