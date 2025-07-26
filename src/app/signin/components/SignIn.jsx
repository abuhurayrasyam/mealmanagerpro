"use client";
import React from 'react';
import SignInWithGoogle from '@/components/Auth/SignInWithGoogle';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import signInAnimation from '@/assets/animations/signin-animation.json';
import PasswordInput from '@/components/Auth/PasswordInput';
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const SignIn = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const { register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
    const response = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl: callbackUrl,
    });

    if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'SignIn Successful',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push(callbackUrl);
    } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password',
        });
    }
    };

    return (
        <div className="hero bg-base-200 min-h-screen py-10">
            <div className='w-11/12 mx-auto'>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <Lottie className='w-90' animationData={signInAnimation} loop={true} />
                    </div>
                    <div className="card bg-base-100 border border-gray-300 w-full max-w-sm shrink-0 shadow-sm pb-3">
                        <div className="card-body">
                            <h1 className="font-semibold text-secondary text-center text-xl">Login your account</h1>
                            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">

                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="input"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className='text-red-500 font-semibold'>{errors.email.message}</p>}

                                <label className="label">Password</label>
                                <PasswordInput
                                    {...register('password', { required: 'Password is required' })}
                                />
                                {errors.password && <p className="text-red-500 font-semibold">{errors.password.message}</p>}

                                <div className='flex items-center gap-1 mt-2'>
                                    <a className="link link-hover">Forgot password?</a>
                                </div>

                                <input type="submit" className="btn btn-primary text-black border-dotted shadow-none border-gray-50 mt-4" value="Login" />
                            </form>

                            <h4 className="text-gray-500 text-center">Don't Have An Account ? <Link href={'/signup'} className="text-red-600">Register</Link></h4>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 border-t border-gray-400"></div>
                                <h4 className="text-gray-600 text-sm">Or</h4>
                                <div className="flex-1 border-t border-gray-400"></div>
                            </div>

                            <SignInWithGoogle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;