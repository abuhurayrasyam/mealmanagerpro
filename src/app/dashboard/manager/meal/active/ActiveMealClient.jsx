"use client";

import React, { useState, useTransition, useEffect } from "react";
import AddMemberModal from "./components/AddMemberModal";
import Swal from "sweetalert2";
import { changeManagerRole, removeMemberFromMeal } from "@/actions/meal/mealActions";

export default function ActiveMealClient({ meal: initialMeal }) {
  const [meal, setMeal] = useState(initialMeal);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(!initialMeal);

  // Optional: If meal might load async, you can fetch here or handle effect
  // useEffect(() => {
  //   if (!meal) {
  //     // Fetch meal or set loading accordingly
  //   }
  // }, []);

  if (loading) return <p>Loading meal data...</p>;
  if (!meal) return <p>No meal found.</p>;

  const manager = meal.members.find((m) => m.role === "manager");

  // Change manager role
  const handleMakeManager = (email) => {
    if (email === manager?.email) {
      Swal.fire("Info", `${manager?.name || "This user"} is already the manager`, "info");
      return;
    }

    Swal.fire({
      title: "Change Manager?",
      text: `Are you sure you want to make this user the manager?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change",
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            await changeManagerRole({ mealId: meal._id, newManagerEmail: email });

            setMeal((prev) => {
              const updatedMembers = prev.members.map((m) => {
                if (m.email === email) return { ...m, role: "manager" };
                if (m.email === manager?.email) return { ...m, role: "user" };
                return m;
              });
              return { ...prev, members: updatedMembers };
            });

            Swal.fire("Success", "Manager role updated.", "success");
          } catch (error) {
            Swal.fire("Error", error.message || "Failed to update role.", "error");
          }
        });
      }
    });
  };

 const handleRemoveMember = (memberEmail) => {
  if (!meal?._id || !memberEmail) {
    Swal.fire("Error", "Meal ID or member email is missing.", "error");
    return;
  }

  Swal.fire({
    title: "Remove Member?",
    text: `Are you sure you want to remove this member?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove",
  }).then((result) => {
    if (result.isConfirmed) {
      startTransition(async () => {
        try {
          const mealIdString = typeof meal._id === 'string' ? meal._id : meal._id.toString();
          console.log("Removing member:", memberEmail, "from meal:", mealIdString);

          await removeMemberFromMeal({ mealId: mealIdString, memberEmail });

          setMeal((prev) => ({
            ...prev,
            members: prev.members.filter((m) => m.email !== memberEmail),
          }));

          Swal.fire("Removed!", "Member has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", error.message || "Failed to remove member.", "error");
        }
      });
    }
  });
};

  // Add member and update UI instantly
  const handleMemberAdded = (newMember) => {
  setModalOpen(false);

  // Enrich with defaults if needed
  const enrichedMember = {
    ...newMember,
    joinedAt: newMember.joinedAt || new Date().toISOString(),
    role: newMember.role || 'user',
  };

  setMeal((prev) => ({
    ...prev,
    members: [...prev.members, enrichedMember],
  }));
};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Active Meal Details
      </h2>

      <div className="mb-4 text-center font-semibold text-gray-700">
        Total Members: <span className="text-primary">{meal.members.length}</span>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Meal Info</h3>
        <p><strong>Meal ID:</strong> {meal._id}</p>
        <p><strong>Meal Name:</strong> {meal.mealName}</p>
        <p><strong>Manager Name:</strong> {manager?.name || "N/A"}</p>
        <p><strong>Manager Email:</strong> {manager?.email || "N/A"}</p>
        <p><strong>Created At:</strong> {new Date(meal.createdAt).toLocaleDateString()}</p>
        <p><strong>Expires At:</strong> {new Date(meal.expiryDate).toLocaleDateString()}</p>

        <button
          onClick={() => setModalOpen(true)}
          className="mt-6 btn btn-primary px-6 py-2 rounded-lg shadow-md hover:shadow-xl transition"
        >
          Add Member
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Meal Members</h3>

        <table className="min-w-full border-collapse">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meal.members.map(({ email, name, role, joinedAt }) => (
              <tr
                key={email}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{name || "N/A"}</td>
                <td className="p-3">{email}</td>
                <td className="p-3 capitalize">{role}</td>
                <td className="p-3">{new Date(joinedAt).toLocaleDateString()}</td>
                <td className="p-3 space-x-2 flex items-center">
                  {role !== "manager" ? (
                    <>
                      <button
                        onClick={() => handleMakeManager(email)}
                        disabled={isPending}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        {isPending ? "Updating..." : "Make Manager"}
                      </button>
                      <button
                        onClick={() => handleRemoveMember(email)}
                        disabled={isPending}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-green-600 font-semibold">Current Manager</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AddMemberModal
          closeModal={() => setModalOpen(false)}
          mealId={meal._id}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}
