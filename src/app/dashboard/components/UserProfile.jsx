'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '@/actions/dashboard/getUserProfile';
import Loading from '@/components/Loading';

const UserProfile = ({ email }) => {
  const [user, setUser] = useState(null);

  // Format date as dd-mm-yyyy hh:mm AM/PM
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const capitalizeFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getUserProfile(email);
        setUser(profile);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [email]);

  if (!user) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] p-6">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 text-center border border-white/30 transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(31,131,237,0.3)]">
        {/* Floating Accent Ring */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-[var(--color-accent)] opacity-20 blur-2xl"></div>

        {/* User Image */}
        <div className="flex justify-center mb-6 relative z-10">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-[var(--color-primary)] shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-[var(--color-secondary)] text-white text-3xl font-bold shadow-lg border-4 border-[var(--color-primary)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] mb-2 tracking-tight">
          {user.name}
        </h2>
        <p className="text-[var(--color-neutral)] mb-4">{user.email}</p>

        <div className="space-y-2 text-left bg-white/60 rounded-xl p-5 shadow-inner">
          <p className="text-[var(--color-neutral)]">
            <strong className="text-[var(--color-secondary)]">Role:</strong>{' '}
            {capitalizeFirst(user.role)}
          </p>
          <p className="text-[var(--color-neutral)] break-words">
            <strong className="text-[var(--color-secondary)]">User ID:</strong>{' '}
            {user._id}
          </p>
          <p className="text-[var(--color-neutral)]">
            <strong className="text-[var(--color-secondary)]">Account Created:</strong>{' '}
            {formatDateTime(user.createdAt)}
          </p>
          <p className="text-[var(--color-neutral)]">
            <strong className="text-[var(--color-secondary)]">Last Sign-in:</strong>{' '}
            {formatDateTime(user.lastLoginAt)}
          </p>
        </div>

        {/* Accent Button Placeholder */}
        <div className="mt-6">
          <button className="px-6 py-2 rounded-full bg-[var(--color-accent)] text-white font-semibold shadow-md hover:bg-[var(--color-primary)] transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
