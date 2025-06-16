import { useState, useContext } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi'; /*npm install react-icons*/
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';
import { GoogleLogin } from '@react-oauth/google'; //npm install react-google-login 
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);
    // const { loginUser, loginWithGoogle } = useContext(AuthContext);    

    return (
        <div>
            <GeneralHeader />
            <ToastContainer/>
            <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 xxsm:pt-24 sm:pt-24 mb:p-8 sm:p-8 xsm:p-8 xxsm:p-4 py-8 mx-auto">
                <div className="job-application-box rounded-xs px-8 py-5 ">
                    <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">Sign in</h1>
                    
                    <form>
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email address</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="email" 
                                id="username" 
                                name="username" 
                                placeholder="applicant@gmail.com" 
                                required 
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
                            />
                        </div>

                        <div className='flex col-span-2'>
                            <Link href="/GENERAL/ForgotPassword" className="ml-auto">
                                <p className="text-xsmall text-accent pt-4 pb-8 font-medium">Forgot password?</p>
                            </Link>
                        </div>

                        <button className="button1 flex items-center w-full p-5">
                            <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall text-center">Sign in</p>
                        </button>
                    </form>

                    <div className="relative flex items-center justify-center my-2 pt-2 pb-2">
                        <hr className="border-t border-gray-400 w-full absolute" />
                        <p className="bg-white px-4 text-gray-600 relative z-10">or</p>
                    </div>

                    {/* TODO */}
                    {/* <button onClick={handleGoogleLogin} className="button2 flex items-center w-full p-5">
                        <Image
                            src="/google.png"
                            width={25}
                            height={18}
                            alt="Google Icon"
                            className="mr-2"
                        />
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall text-center font-medium flex-grow">Continue with Google</p>
                    </button> */}

                    <div className='flex justify-center w-full px-5'>
                        <GoogleLogin 
                            // onSuccess={loginWithGoogle}
                            onError={() => toast.error('Google login failed!')} 
                            size='large'
                        />
                    </div>
                
                    <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">Don’t have an account? <span className="font-semibold"><Link href="/GENERAL/Register" className='underline' >Register</Link></span></p>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
