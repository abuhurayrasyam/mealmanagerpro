'use client';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';

const SignInWithGoogle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleGoogleSignIn = async () => {
    try {
      Swal.fire({
        title: 'Signing in...',
        text: 'Please wait while we sign you in with Google.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await signIn('google', { callbackUrl });
      Swal.close();
      router.push(callbackUrl);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sign-in Failed',
        text: error.message || 'Something went wrong during Google sign-in.',
      });
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="btn btn-outline mt-1">
      <FcGoogle className="text-xl" /> Continue with Google
    </button>
  );
};

export default SignInWithGoogle;
