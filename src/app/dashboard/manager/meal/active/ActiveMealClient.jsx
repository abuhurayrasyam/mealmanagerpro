'use client';

import React, { useState, useTransition } from "react";
import AddMemberModal from "./components/AddMemberModal";
import Swal from "sweetalert2";
import { changeManagerRole, removeMemberFromMeal } from "@/actions/meal/mealActions";
import { motion } from "framer-motion";

export default function ActiveMealClient({ meal: initialMeal }) {
  const [meal, setMeal] = useState(initialMeal);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(!initialMeal);

  if (loading) return <p className="text-center mt-12 text-lg text-gray-600">Loading meal data...</p>;
  if (!meal) return <p className="text-center mt-12 text-lg text-red-500">No meal found.</p>;

  const manager = meal.members.find((m) => m.role === "manager");

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

  const handleMemberAdded = (newMember) => {
    setModalOpen(false);
    const enrichedMember = { ...newMember, joinedAt: newMember.joinedAt || new Date().toISOString(), role: newMember.role || 'user' };
    setMeal((prev) => ({ ...prev, members: [...prev.members, enrichedMember] }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gradient bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }}
      >
        Active Meal Details
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center font-semibold mb-6 text-gray-700"
      >
        Total Members: <span className="text-primary">{meal.members.length}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 mb-8 relative overflow-hidden border border-[var(--color-primary)]"
      >
        <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-[var(--color-accent)]">Meal Info</h3>
        <p><strong>Meal ID:</strong> {meal._id}</p>
        <p><strong>Meal Name:</strong> {meal.mealName}</p>
        <p><strong>Manager Name:</strong> {manager?.name || "N/A"}</p>
        <p><strong>Manager Email:</strong> {manager?.email || "N/A"}</p>
        <p><strong>Created At:</strong> {new Date(meal.createdAt).toLocaleDateString()}</p>
        <p><strong>Expires At:</strong> {new Date(meal.expiryDate).toLocaleDateString()}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="mt-6 py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          Add Member
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="overflow-x-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-[var(--color-accent)]"
      >
        <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-[var(--color-primary)]">Meal Members</h3>

        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
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
              <tr key={email} className="border-b hover:bg-[var(--color-primary)]/10 transition-colors">
                <td className="p-3">{name || "N/A"}</td>
                <td className="p-3">{email}</td>
                <td className="p-3 capitalize">{role}</td>
                <td className="p-3">{new Date(joinedAt).toLocaleDateString()}</td>
                <td className="p-3 flex items-center gap-2">
                  {role !== "manager" ? (
                    <>
                      <button
                        onClick={() => handleMakeManager(email)}
                        disabled={isPending}
                        className="btn btn-sm bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow hover:brightness-110 transition-all"
                      >
                        {isPending ? "Updating..." : "Make Manager"}
                      </button>
                      <button
                        onClick={() => handleRemoveMember(email)}
                        disabled={isPending}
                        className="btn btn-sm bg-red-500 text-white shadow hover:brightness-110 transition-all"
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
      </motion.div>

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
