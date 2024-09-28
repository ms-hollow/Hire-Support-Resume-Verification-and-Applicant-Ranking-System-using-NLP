"use client"
import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi'; /*npm install react-icons*/

/*import { useRouter } from 'next/router';*/
import { useState } from 'react';


export default function Login() {

   /* const{ router } = useRouter()*/
    const [isLoading, setIsLoading] = useState(false);


    const [showPassword, setShowPassword] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);

    const handleChange = (e) => {
        setHasTyped(e.target.value.length > 0);
        
    };
    
    return (
        <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-20 mx-auto">
            <div className="box-container px-10 py-10 ">
                <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">Sign in</h1>

                <form>
                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Email address</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                            <input type="text" id="email-address" name="email" placeholder="applicant@gmail.com" required ></input>
                        </div>

                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 font-semibold">Password</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                            <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="" required  onChange={handleChange} ></input>  
                              
                        </div>
                        
                    <Link href=""> 
                        <p className="text-small text-accent font-medium pt-4 pb-8 font-medium text-right">Forgot password?</p> 
                    </Link> 

                    <button className="button1 flex items-center w-full p-5">
                        <p className="lg:text-large mb:text-medium sm:text-small xsm:text-small text-center">Sign in</p>
                    </button>   
                </form>
                  

                <div className="relative flex items-center justify-center my-8 pb-8">
                    <hr className="border-t border-gray-400 w-full absolute" />
                    <p className="bg-white px-4 text-gray-600 relative z-10">or</p>
                </div>
                
                <button className="button2 flex items-center w-full p-5">
                    <Image 
                        src="/google.png" 
                        width={25} 
                        height={18} 
                        alt="Google Icon" 
                        className="mr-2" // Space between image and text
                    />
                    <p className="lg:text-large mb:text-medium sm:text-small xsm:text-small text-center font-medium flex-grow">Continue with Google</p>
                </button>
                <p className="text-small text-fontcolor pt-4 pb-1 font-medium">Don’t have an account? <span className="font-semibold"><Link href="/Register" className='underline' >Register</Link></span></p> 
            </div> 

        </div>
    );
}

