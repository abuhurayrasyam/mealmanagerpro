'use client';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const SignInWithGoogle = () => {

    const handleGoogleSignIn = () => {
        
    }

    return (
        <button onClick={handleGoogleSignIn} className="btn btn-outline mt-1"><FcGoogle className="text-xl" />Continue with Google</button>
    );
};

export default SignInWithGoogle;