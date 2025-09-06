'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { addBazar } from '@/actions/dashboard/manager/addBazar';

const AddBazarForm = () => {
  const { data: session } = useSession();
  const [bazarData, setBazarData] = useState({
    date: '',
    amount: '',
    details: ''
  });

  const handleChange = e => {
    setBazarData({ ...bazarData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await addBazar({ ...bazarData, email: session?.user?.email || 'unknown' });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Bazar added successfully!',
        timer: 2000,
        showConfirmButton: false
      });

      setBazarData({ date: '', amount: '', details: '' });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to add bazar. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white shadow-xl rounded-2xl border border-primary">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">🛒 Add a Bazar</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1 text-secondary">Date</label>
          <input
            type="date"
            name="date"
            value={bazarData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-secondary">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={bazarData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-secondary">Details</label>
          <textarea
            name="details"
            value={bazarData.details}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-secondary">User Email</label>
          <input
            type="email"
            value={session?.user?.email || 'Unknown'}
            readOnly
            className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300"
        >
          ➕ Add Bazar
        </button>
      </form>
    </div>
  );
};

export default AddBazarForm;
