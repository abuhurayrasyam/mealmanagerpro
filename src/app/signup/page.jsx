"use client";
import React, { Suspense } from 'react';
import SignUp from './components/SignUp';
import Loading from '@/components/Loading';

const page = () => {
    return (
        <Suspense fallback={Loading}>
            <SignUp></SignUp>
        </Suspense>
    );
};

export default page;