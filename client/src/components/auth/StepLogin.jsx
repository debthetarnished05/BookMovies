import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { BeatLoader } from 'react-spinners';

const StepLogin = ({ onNext }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginRequest, isAuthLoading } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        if(!email || !password) return;
        
        loginRequest({ email, password });
    }

  return (
    <div className='flex flex-col gap-3 px-10 py-6'>
        <h2 className='text-center text-lg font-semibold'>Log in to your account</h2>
        <p className='text-center text-sm text-gray-500'>Welcome back! Please enter your details.</p>
    
        <div className='flex items-center border rounded-md border-gray-300 px-4 py-3'>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='flex-grow outline-none text-base'
                required
            />
        </div>

        <div className='flex items-center border rounded-md border-gray-300 px-4 py-3 mt-2'>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='flex-grow outline-none text-base'
                required
            />
        </div>

        <button type='submit' onClick={handleLogin} disabled={isAuthLoading} className='w-full mt-4 cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition disabled:bg-gray-400'>
            {isAuthLoading ? <BeatLoader size={12} color="white" /> : "Sign In"}
        </button>

        <p className='text-gray-500 text-center m-auto text-sm mt-4'>
            Don't have an account? <span onClick={onNext} className='text-[#f74565] cursor-pointer hover:underline'>Sign Up</span>
        </p>
    </div>
  )
}

export default StepLogin;
