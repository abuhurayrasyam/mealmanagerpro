'use client';

import { addMealAndBecomeManager } from '@/actions/meal/meal';
import React, { useState, useEffect, useTransition } from 'react';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const packages = {
  monthly: 30,
  yearly: 365,
};

const OpenMealPage = () => {
  const { data: session, status } = useSession();
  const [packageType, setPackageType] = useState('monthly');
  const [mealName, setMealName] = useState('');
  const [createdDate, setCreatedDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCreatedDate(new Date());
  }, []);

  useEffect(() => {
    const expiry = new Date(createdDate);
    expiry.setDate(expiry.getDate() + packages[packageType]);
    setExpiryDate(expiry);
  }, [packageType, createdDate]);

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mealName.trim()) {
      Swal.fire('Error', 'Please enter a meal name.', 'error');
      return;
    }

    if (!session?.user?.email) {
      Swal.fire('Error', 'User email not found. Please login.', 'error');
      return;
    }

    if (!session?.user?.name) {
      Swal.fire('Error', 'User name not found. Please complete your profile.', 'error');
      return;
    }

    startTransition(async () => {
      try {
        await addMealAndBecomeManager({
          mealName,
          packageType,
          createdDate: createdDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          email: session.user.email,
          name: session.user.name,  // <-- Added here
        });

        Swal.fire('Success', 'Meal created and role updated to manager!', 'success');
        setMealName('');
        setPackageType('monthly');
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong!', 'error');
      }
    });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Please login to open a meal package.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-primary">Open a Meal Package</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Select Package</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setPackageType('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                packageType === 'monthly'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition`}
              disabled={isPending}
            >
              Monthly (30 days)
            </button>

            <button
              type="button"
              onClick={() => setPackageType('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                packageType === 'yearly'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition`}
              disabled={isPending}
            >
              Yearly (365 days)
            </button>
          </div>
        </div>

        {/* Meal Name */}
        <div>
          <label htmlFor="mealName" className="block mb-2 font-semibold text-gray-700">
            Meal Name
          </label>
          <input
            id="mealName"
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Enter meal name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isPending}
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={session.user.email}
            readOnly
            className="w-full bg-gray-100 rounded-md px-4 py-2 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Created Date */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Created Date</label>
          <input
            type="text"
            readOnly
            value={formatDate(createdDate)}
            className="w-full bg-gray-100 rounded-md px-4 py-2 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Expiry Date</label>
          <input
            type="text"
            readOnly
            value={formatDate(expiryDate)}
            className="w-full bg-gray-100 rounded-md px-4 py-2 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
          } transition`}
        >
          {isPending ? 'Processing...' : 'Open Meal & Become Manager'}
        </button>
      </form>
    </div>
  );
};

export default OpenMealPage;
