'use client';
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {

    const navLinks = (
        <>
            <Link href={'/'}>Home</Link>
            <Link href={'/dashboard'}>My Profile</Link>
            <Link href={'/dashboard/manager/bazar/add'}>Add Bazar</Link>
            <Link href={'/dashboard/manager/meal/active'}>Active Meals</Link>
        </>
    )

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">

        <div className="navbar bg-[#FFFFFF] w-full px-4 flex justify-between items-center">
            <div className="flex items-center">
                <label
                htmlFor="my-drawer-2"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost lg:hidden"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current text-primary"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                </label>
                <div className="ml-2 text-primary font-bold text-lg lg:hidden">Dashboard</div>
            </div>
            <Link href={'/dashboard/member/open-a-meal'}><button className="btn btn-primary">Open a Meal</button></Link>
        </div>

        <div className="bg-[#f3f4f6] min-h-screen p-4">
          {children}
        </div>
      </div>


      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-secondary text-accent font-bold text-md md:text-xl min-h-full w-80 p-4">
          <div className="mb-5">
            {/* <Logo /> */}
          </div>
          {navLinks}
        </ul>
      </div>
    </div>
  );
}
