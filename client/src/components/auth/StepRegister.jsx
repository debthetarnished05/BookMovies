import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { BeatLoader } from 'react-spinners';

const StepRegister = ({ onPrev }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    
    const { registerRequest, isAuthLoading } = useAuth();

    const handleRegister = (e) => {
        e.preventDefault();
        if(!name || !email || !phone || !password) return;
        
        registerRequest({ name, email, phone, password });
    }

  return (
    <div className='flex flex-col gap-3 px-10 py-6'>
        <h2 className='text-center text-lg font-semibold'>Create an account</h2>
        <p className='text-center text-sm text-gray-500'>Please fill in your details below.</p>
    
        <div className='flex items-center border rounded-md border-gray-300 px-4 py-2'>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder='Full Name'
                className='flex-grow outline-none text-sm'
                required
            />
        </div>

        <div className='flex items-center border rounded-md border-gray-300 px-4 py-2 mt-1'>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder='Email Address'
                className='flex-grow outline-none text-sm'
                required
            />
        </div>

        <div className='flex items-center border rounded-md border-gray-300 px-4 py-2 mt-1'>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder='Phone Number'
                className='flex-grow outline-none text-sm'
                required
            />
        </div>

        <div className='flex items-center border rounded-md border-gray-300 px-4 py-2 mt-1'>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='flex-grow outline-none text-sm'
                required
            />
        </div>

        <button type='submit' onClick={handleRegister} disabled={isAuthLoading} className='w-full mt-2 cursor-pointer text-white bg-black py-2 rounded-md text-base hover:bg-gray-800 transition disabled:bg-gray-400'>
            {isAuthLoading ? <BeatLoader size={12} color="white" /> : "Sign Up"}
        </button>

        <p className='text-gray-500 text-center m-auto text-sm mt-3'>
            Already have an account? <span onClick={onPrev} className='text-[#f74565] cursor-pointer hover:underline'>Log In</span>
        </p>
    </div>
  )
}

export default StepRegister;
