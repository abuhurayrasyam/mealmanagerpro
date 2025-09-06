'use client';

import { addMemberToMeal } from '@/actions/meal/addMemberToMeal';
import React, { useState, useTransition } from 'react';
import Swal from 'sweetalert2';

const AddMemberModal = ({ closeModal, mealId, onMemberAdded }) => {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMember = () => {
    if (!isValidEmail(email)) {
      Swal.fire('Error', 'Please enter a valid email address.', 'error');
      return;
    }

    startTransition(async () => {
      try {
        // Await the new member returned from the server action
        const newMember = await addMemberToMeal({ email, mealId, role: 'user' });

        Swal.fire('Success', 'Member added successfully!', 'success');
        setEmail('');
        closeModal();

        // Pass the new member to parent to update UI immediately
        if (onMemberAdded) onMemberAdded(newMember);
      } catch (error) {
        Swal.fire('Error', error.message || 'Failed to add member.', 'error');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Add Member</h2>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          disabled={isPending}
        />
        <div className="flex justify-end space-x-3">
          <button className="btn" onClick={closeModal} disabled={isPending}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddMember}
            disabled={isPending || !isValidEmail(email)}
          >
            {isPending ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
