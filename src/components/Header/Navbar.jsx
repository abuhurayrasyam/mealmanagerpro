'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOut from '../Auth/SignOut';

const Navbar = () => {

    const { data: session, status } = useSession();
    const pathname = usePathname();

    const navLinks = (
        <>
            <Link href={'/'} className={`m-2 text-[18px] font-bold cursor-pointer ${pathname === '/' ? 'text-primary' : ' text-secondary hover:text-accent'}`}>Home</Link>
        </>
    )

    return (
        <nav className="bg-base-100 shadow-sm">
            <div className='navbar w-11/12 mx-auto'>
                <div className="navbar-start">
                    <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navLinks}
                    </ul>
                    </div>
                    <Link href={'/'} className="text-xl text-accent font-bold">MealManager<span className='text-primary'>Pro</span></Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                </div>
                <div className="navbar-end">
                    {
                        status == 'authenticated' ? (
                            <SignOut></SignOut>
                        ) : (
                            <Link href={'/signin'} className='btn hover:bg-secondary hover:text-white mr-2'>SignIn</Link>
                        )
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;