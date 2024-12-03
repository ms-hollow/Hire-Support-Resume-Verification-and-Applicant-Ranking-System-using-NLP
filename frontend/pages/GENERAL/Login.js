import { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi'; /*npm install react-icons*/
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';
import axios from 'axios'; //npm install axios

//TODO 1. Ayusin Google Auth 2. Setup forgot password

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '', password: ''
    });

    // Submit login form for regular login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            if (!formData.email || !formData.password) {
                setError('Please fill in the fields.');
                return;
            }

            // Validate email format (basic regex)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address.');
                return;
            }

            const response = await axios.post('http://127.0.0.1:8000/users/login/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful login
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            const userRole = response.data.role;  // 'company' or 'applicant'

            // Redirect based on user role
            if (userRole === 'company') {
                window.location.href = '/GENERAL/Register'; //! Company Home
            } else if (userRole === 'applicant') {
                window.location.href = '/APPLICANT/ApplicantHome';
            }
        } catch (err) {
            console.log('Error details:', err.response);

            if (err.response && err.response.status === 404) {
                setError(err.response.data.error || 'Email does not exist');
            } else if (err.response && err.response.status === 400) {
                setError('Invalid email or password');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <GeneralHeader />
            <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-8 mx-auto">
                <div className="box-container px-8 py-5 ">
                    <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">Sign in</h1>

                    <form>
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email address</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                placeholder="applicant@gmail.com" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pt-4 text-fontcolor pb-1 font-medium">Password</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                name="password" 
                                placeholder="" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className='flex col-span-2'>
                            {error && <div className="text-xsmall text-accent pt-4 pb-8 font-medium">{error}</div>}
                            <Link href="/GENERAL/ForgotPassword" className="ml-auto">
                                <p className="text-xsmall text-accent pt-4 pb-8 font-medium">Forgot password?</p>
                            </Link>
                        </div>

                        <button className="button1 flex items-center w-full p-5" onClick={handleSubmit}>
                            <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall text-center">Sign in</p>
                        </button>
                    </form>

                    <div className="relative flex items-center justify-center my-2 pt-2 pb-2">
                        <hr className="border-t border-gray-400 w-full absolute" />
                        <p className="bg-white px-4 text-gray-600 relative z-10">or</p>
                    </div>

                    <button className="button2 flex items-center w-full p-5">
                        <Image
                            src="/google.png"
                            width={25}
                            height={18}
                            alt="Google Icon"
                            className="mr-2"
                        />
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall text-center font-medium flex-grow">Continue with Google</p>
                    </button>
                
                    <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">Don’t have an account? <span className="font-semibold"><Link href="/GENERAL/Register" className='underline' >Register</Link></span></p>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
