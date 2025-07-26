'use client';
import React from 'react';
import Link from 'next/link';
import SignInWithGoogle from '@/components/Auth/SignInWithGoogle';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import signUpAnimation from '@/assets/animations/signup-animation.json';
import PasswordInput from '@/components/Auth/PasswordInput';
import { signUpUser } from '@/actions/auth/signUpUser';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { signIn } from 'next-auth/react';

const SignUp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        try {
            const result = await signUpUser(data);

            if (result) {
                const signInResponse = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResponse?.ok) {
                    Swal.fire({
                    icon: "success",
                    title: "SignUp Successfully Completed",
                    timer: 2000,
                    showConfirmButton: false,
                    });
                    router.push(callbackUrl);
                } else {
                    Swal.fire({
                    icon: "error",
                    title: "Login Failed After Signup",
                    text: "Please try to login manually.",
                    });
                }
            } else {
            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: "User already exists or invalid data.",
            });
            }

        } catch (error) {
            Swal.fire({
            icon: "error",
            title: "SignUp Failed",
            text: error?.message || "Something went wrong!",
            });
        }
        };

    return (
        <div className="hero bg-base-200 min-h-screen py-10">
            <div className='w-11/12 mx-auto'>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <Lottie className='w-90' animationData={signUpAnimation} loop={true}></Lottie>
                    </div>
                    <div className="card bg-base-100 border border-gray-300 w-full max-w-sm shrink-0 shadow-sm pb-3">
                        <div className="card-body">
                            <h1 className="font-semibold text-secondary text-center text-xl">Create an account</h1>
                            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">

                                <label className="label">Your Name</label>
                                <input type="text" {...register('name', {required: true, maxLength: 20})} className="input" placeholder="Enter your name" />
                                {
                                    errors.name?.type === 'required' && <p className='text-red-500 font-semibold'>Name is required</p>
                                }

                                <label className="label">Email</label>
                                <input type="email" {...register('email', {required: true})} className="input" placeholder="Enter your email" />
                                {
                                    errors.email?.type === 'required' && <p className='text-red-500 font-semibold'>Email is required</p>
                                }

                                <label className="label">Password</label>
                                <PasswordInput {...register('password', {
                                    required: 'Password is required',
                                    validate: {
                                        hasUppercase: (value) =>
                                            /[A-Z]/.test(value) || 'Add at least one uppercase letter',
                                        hasLowercase: (value) =>
                                            /[a-z]/.test(value) || 'Add at least one lowercase letter',
                                        hasNumber: (value) =>
                                            /\d/.test(value) || 'Add at least one number',
                                        hasSpecialChar: (value) =>
                                            /[^A-Za-z0-9]/.test(value) || 'Add at least one special character',
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters',
                                    }
                                })}></PasswordInput>
                                {
                                    errors.password && <p className="text-red-500 font-semibold">{errors.password.message}</p>
                                }

                                <div className='flex items-center gap-1 mt-2'>
                                    <input type="checkbox" {...register('termsAndConditions', {required: true})} className="checkbox h-5 w-5" />
                                    <a className="link link-hover">Accept Terms & Conditions</a>
                                </div>
                                {
                                    errors.termsAndConditions?.type === 'required' && <p className='text-red-500 font-semibold'>You must accept the terms and conditions</p>
                                }

                                <input type="submit" className="btn btn-primary text-black border-dotted shadow-none border-gray-50 mt-4" value="Register" />
                            </form>
                            <h4 className="text-gray-500 text-center">Already Have an Account ? <Link href={'/signin'} className="text-red-600">Login</Link></h4>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 border-t border-gray-400"></div>
                                <h4 className="text-gray-600 text-sm">Or</h4>
                                <div className="flex-1 border-t border-gray-400"></div>
                            </div>
                            <SignInWithGoogle></SignInWithGoogle>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;