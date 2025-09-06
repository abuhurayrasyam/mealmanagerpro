'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaHome, FaInstagram, FaPhoneAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="bg-secondary shadow-xl text-base-content">
            <div className="footer sm:footer-horizontal w-11/12 mx-auto p-5 lg:justify-around text-white">
                <nav>
                    <h6 className="footer-title">Contact</h6>
                    <div className="flex gap-2 items-center">
                        <FaPhoneAlt size={15} />
                        <h4>+880 1500-000000</h4>
                    </div>
                    <div className="flex gap-2 items-center">
                        <MdEmail size={18} />
                        <h4>abuhurayrasyamofficial@gmail.com</h4>
                    </div>
                    <div className="flex gap-2 items-center">
                        <FaHome size={18} />
                        <h4>MUSAFIR House, Ghatail, Tangail-1980</h4>
                    </div>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <Link href={'/'} target="_blank" className="link link-hover">Terms and Conditions</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Social</h6>
                    <div className="grid grid-flow-col gap-4 items-center">
                    <Link href={'https://www.x.com'} target="_blank">
                        <FaXTwitter size={23} />
                    </Link>
                    <Link href={'https://www.instagram.com'} target="_blank">
                        <FaInstagram size={24} />
                    </Link>
                    <Link href={'https://www.facebook.com'} target="_blank">
                    <FaFacebookF size={24} />
                    </Link>
                    </div>
                </nav>
            </div>
            <div className="bg-primary border-b-5 border-secondary py-4">
                <p className="text-center w-11/12 mx-auto md:text-sm text-[12px] text-muted font-medium">Copyright © {new Date().getFullYear()} - All right reserved by Meal Manager Pro</p>
            </div>
        </footer>
    );
};

export default Footer;