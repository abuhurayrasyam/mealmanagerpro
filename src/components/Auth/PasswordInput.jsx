'use client';
import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const PasswordInput = ({...rest}, ref) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='relative'>
            <input type={showPassword ? "text" : "password"} className="input" placeholder="Enter your password" ref={ref} {...rest} />
            <button type='button' onClick={() => {setShowPassword(!showPassword)}} className='absolute top-3 right-7 cursor-pointer'>
                {
                    showPassword ? <IoEyeOutline size={15} /> : <IoEyeOffOutline size={15} />
                }
            </button>
        </div>
    );
};

export default PasswordInput;