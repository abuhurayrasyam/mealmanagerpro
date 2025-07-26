"use client";
import React, { Suspense } from 'react';
import SignIn from './components/SignIn';
import Loading from '@/components/Loading';

const page = () => {
    return (
        <Suspense fallback={Loading}>
            <SignIn></SignIn>
        </Suspense>
    );
};

export default page;