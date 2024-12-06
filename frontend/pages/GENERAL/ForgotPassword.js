import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, useEffect  } from 'react';
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';
import PersonalInfo from '@/components/PersonalInfo';
import axios from 'axios';
import { useRouter } from 'next/router';

//TODO

export default function ForgotPassword() {

    const router = useRouter();
    const { uidb64, token } = router.query;  

    const [step, setStep] = useState(1); // Tracks the current step
    const [showPassword, setShowPassword] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmailAddress(e.target.value); 
    };
    
    const getEmail = async (e) => {
        e.preventDefault(); // Prevent form submission and page reload

        console.log('Email Address Submitted:', emailAddress);
        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailAddress) {
            console.log('Please input an email address.');
            return;
        }
        
        if (!emailRegex.test(emailAddress)) {
            console.log('Invalid email address. Please input a valid email address.');
            return;
        }
        
        try {
            // Check if the email exists in the backend
            const emailCheckResponse = await axios.post('http://127.0.0.1:8000/users/auth-email/', { email: emailAddress });
            console.log("Email exists:", emailCheckResponse.data);
            // If email exists, proceed with password reset request
            
            if (emailCheckResponse.data.exists) {
                const response = await axios.post('http://127.0.0.1:8000/users/password_reset/', 
                    { email: emailAddress },
                    {
                        headers: {
                            'X-CSRFToken': csrfToken,  // Attach CSRF token to the request headers
                        }
                    }
                );
                console.log("Password reset email sent:", response.data);
            } else {
                console.log("Email not found.");
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    console.log('Account Not Found.');
                } else {
                    console.log('An unexpected server error occurred. Please try again.');
                }
            } else {
                console.log('Network error. Please check your connection and try again.');
            }
        }
    };
    
    
    const handleChange = (e) => {
        setHasTyped(e.target.value.length > 0);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleNextStep = () => {
        setStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep(prevStep => prevStep - 1); // Move to the previous step
    };

    const handleShowPersonalInfo = () => {
        setShowPersonalInfo(true);
    };

    return (
        <div className='pb-20'>
            <GeneralHeader />
                <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-8 mx-auto">
                    <div className="box-container px-8 py-5">     
                        {step === 1 && (
                            // Step 1: Enter your email to reset password.
                            <form onSubmit={getEmail}>
                                <div className="flex flex-col items-center mt-8">
                                    <div className="flex justify-center  h-full mb-5">
                                        <Image 
                                            src="/Password Icon.svg" 
                                            width={60} 
                                            height={60} 
                                            alt="Password Icon" 
                                        />
                                    </div>
                                    <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary mb-0">Forgot your password?</h1>
                                    <p className="font-medium lg:text-xsmall mb:text-xsmall sm:text-xsmall pb-5 text-fontcolor">Enter your email to reset password.</p>
                                </div>
  
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email Address</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input type="email" id="email-address" name="email" placeholder="applicant@gmail.com" onChange={handleEmailChange} required></input>
                                </div>

                                <button className="button1 mt-10  w-full flex items-center justify-center"> 
                                    <div className="flex items-center ">
                                        <p className="lg:text-medium mb:text-medium sm:text-xxsmal xsm:text-xsmall font-medium text-background">Continue</p>
                                    </div>
                                </button>

                                <div className="flex items-center mt-10">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <Link href="/GENERAL/Login"> <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center text-fontcolor">Return to login</p> </Link>
                                    </div>

                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            // Step 2: Set New Password
                            <form>
                                <div className="flex flex-col items-center mt-8">
                                    <div className="flex justify-center  h-full mb-5">
                                        <Image 
                                            src="/New Password Icon.svg" 
                                            width={60} 
                                            height={60} 
                                            alt="Password Icon" 
                                        />
                                    </div>
                                    <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary mb-0">Set your new password</h1>
                                    <p className="font-medium lg:text-xsmall mb:text-xsmall sm:text-xsmall pb-5 text-fontcolor">Password should be different from your previous password.</p>
                                </div>
                                
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pt-4 pb-1 font-medium"> New Password</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input type={showPassword ? 'text' : 'password'} id="new-password" name="new-password" required onChange={handleChange} />
                                </div>

                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pt-4 pb-1 text-fontcolor font-medium">Confirm Password</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input type={showPassword ? 'text' : 'password'} id="confirm-password" name="confirmPassword" required onChange={handleChange} />
                                </div>

                                <button className="button1 mt-10  w-full flex items-center justify-center" onClick={handleNextStep}> 
                                    <div className="flex items-center ">
                                        <p className="lg:text-medium mb:text-medium sm:text-xxsmal xsm:text-xsmall font-medium text-background ">Continue</p>
                                    </div>
                                </button>

                                <div className="flex items-center mt-10">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <Link href="/GENERAL/Login"> <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center text-fontcolor">Return to login</p> </Link>
                                    </div>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            // Step 3: Password Reset
                            <form>
                                <div className="flex flex-col mt-8 items-center">
                                    <div className="flex justify-center h-full mb-5">
                                        <Image 
                                            src="/Reset Icon.svg" 
                                            width={60} 
                                            height={60} 
                                            alt="Password Icon" 
                                        />
                                    </div>
                                    <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary mb-0"> Password Reset</h1>
                                    <p className="font-medium lg:text-xsmall mb:text-xsmall sm:text-xsmall pb-5 text-fontcolor">Password has been successfully reset. Click below to continue your access.</p>
                                </div>
  
                              
                                <Link href="/GENERAL/Login">
                                    <button className="button1 mt-5  w-full flex items-center justify-center"> 
                                        <div className="flex items-center ">
                                            <p className="lg:text-medium mb:text-medium sm:text-xxsmal xsm:text-xsmall font-medium text-background">Continue</p>
                                        </div>
                                    </button>
                                </Link>
                            </form>
                        )}
                    </div>
                </div>
            <GeneralFooter/>
        </div>
    );
}
