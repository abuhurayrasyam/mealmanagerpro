'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { addBazar } from '@/actions/dashboard/manager/addBazar';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto my-12 p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-[var(--color-primary)] relative overflow-hidden"
    >
      {/* Decorative floating circles */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-accent)]/20 rounded-full animate-pulse-slower"></div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-[var(--color-primary)] drop-shadow-lg">
        🛒 Add a Bazar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-secondary)]">Date</label>
          <input
            type="date"
            name="date"
            value={bazarData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-secondary)]">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={bazarData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-secondary)]">Details</label>
          <textarea
            name="details"
            value={bazarData.details}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none resize-none transition"
          ></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-secondary)]">User Email</label>
          <input
            type="email"
            value={session?.user?.email || 'Unknown'}
            readOnly
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-600"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          Add Bazar
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddBazarForm;
