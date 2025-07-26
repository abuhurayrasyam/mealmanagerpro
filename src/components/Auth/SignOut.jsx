'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    
    Swal.fire({
      icon: 'success',
      title: 'Signed Out Successful',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      router.push('/signin');
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="btn hover:bg-secondary hover:text-white mr-2"
    >
      Sign Out
    </button>
  );
};

export default SignOut;