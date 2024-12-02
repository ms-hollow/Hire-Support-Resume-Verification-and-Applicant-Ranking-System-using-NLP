import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';
import PersonalInfo from '@/components/PersonalInfo';



export default function Register() {
    const [step, setStep] = useState(0); // Tracks the current step
    const [showPassword, setShowPassword] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);

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
        <div className="pb-20">
            <GeneralHeader />
            <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-8 mx-auto">
                
                {/* Step 0: Selection Buttons */}
                {step === 0 && (
                    <div className="box-container px-8 py-5">
                        <div className="flex flex-col items-center mt-8">
                            <div className="flex justify-center h-full mb-5">
                                <Image 
                                    src="/Register Icon.svg" 
                                    width={60} 
                                    height={60} 
                                    alt="Register Icon" 
                                />
                            </div>
                            <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary mb-0">Register</h1>
                            <p className="lg:text-small mb:text-small sm:text-small text-small text-fontcolor mb-0">as</p>
                        </div>

                        <div className="flex flex-col items-center mt-5 mb-5 space-y-4">

                              {/* PAGPINILI ITO YUNG SA REG FORM AY CompanyInfo */}
                            <button className="button1 h-[40px] flex items-center px-6 py-3" onClick={handleNextStep}>
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src="/Company Icon.svg"
                                        width={19}
                                        height={10}
                                        alt="Company Icon"
                                    />
                                    <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall font-medium text-center">Company</p>
                                </div>
                            </button>

                             {/* PAGPINILI ITO YUNG SA REG FORM AY PersonalInfo */}
                            <button className="button1 flex items-center px-6 py-3" onClick={handleNextStep}>
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src="/Applicant Icon.svg"
                                        width={19}
                                        height={10}
                                        alt="Applicant Icon"
                                    />
                                    <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall font-medium text-center">Applicant</p>
                                </div>
                            </button>

                            <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                  Already have an account? <span className="font-semibold"><Link href="/GENERAL/Login" className='underline'>Sign in</Link></span>
                              </p>
                        </div>
                    </div>
                )}

                {/* Steps 1-3 */}
                {step > 0 && (
                    <div className="box-container px-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">Register</h1>
                            {step === 3 && (
                                <Link href="/APPLICANT/ApplicantHome">
                                    <button className="text-primary font-medium lg:text-medium mb:text-medium sm:text-xxsmall">
                                        Skip
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center pb-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div className={`relative h-1 rounded-full transition-all duration-300 ${
                                    step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'} bg-primary`}>
                                </div>
                            </div>
                        </div>
                        <p className="font-medium lg:text-medium mb:text-medium sm:text-medium pb-7 text-fontcolor">
                            {step === 1 ? "Register Email Address" : step === 2 ? "Confirm Password" : ""}
                        </p>

                        {/* Step 1: Register Email */}
                        {step === 1 && (
                            <form>
                            <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email Address</p>
                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                <input type="text" id="email-address" name="email" placeholder="applicant@gmail.com" required></input>
                            </div>

                            {/*checkbox*/}
                            <div className="flex pt-8 pb-1">
                                <input type="checkbox"value="" id="agreement" className="flex items-start h-5 w-8 "/>
                                <p className="text-fontcolor text-xsmall items-center justify-center ml-4"> By creating an account or signing in, you understand and agree to our Terms. By using our platform, you acknowledge that you have read, understood, and agree to our <span className="font-medium"> <Link href="" className="underline">Terms & Condition</Link></span> and <span className="font-medium"> <Link href="" className="underline">Privacy Policy</Link></span> that outlines how we collect, use, and protect your personal information.</p>      
                            </div>

                            <div className="flex justify-between mt-12">
                                <button type="button" className="button2 flex items-center justify-center" onClick={handlePreviousStep}>
                                       <div className="flex items-center space-x-2">
                                           <Image 
                                               src="/Arrow Left.svg" 
                                               width={23} 
                                               height={10} 
                                               alt="Back Icon" 
                                           />
                                           <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                       </div>
                                </button>

                                 <button type="button" className="button1 flex items-center justify-center" onClick={handleNextStep}>
                                       <div className="flex items-center space-x-2">
                                           <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
                                           <Image 
                                               src="/Arrow Right.svg" 
                                               width={23} 
                                               height={10} 
                                               alt="Continue Icon" 
                                           />
                                       </div>
                                   </button>
                               </div>
                            <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                Already have an account? <span className="font-semibold"><Link href="/GENERAL/Login" className='underline'>Sign in</Link></span>
                            </p>
                        </form>
                        )}

                        {/* Step 2: Confirm Password */}
                        {step === 2 && (
                           <form>
                           <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Password</p>
                               <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                   <input type={showPassword ? 'text' : 'password'} id="password" name="password" required onChange={handleChange} />
                               </div>

                               <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pt-4 pb-1 text-fontcolor font-medium">Confirm Password</p>
                               <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                   <input type={showPassword ? 'text' : 'password'} id="confirm-password" name="confirmPassword" required onChange={handleChange} />
                               </div>
                               

                               <div className="flex justify-between mt-12">
                                   <button type="button" className="button2 flex items-center justify-center" onClick={handlePreviousStep}>
                                       <div className="flex items-center space-x-2">
                                           <Image 
                                               src="/Arrow Left.svg" 
                                               width={23} 
                                               height={10} 
                                               alt="Back Icon" 
                                           />
                                           <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                       </div>
                                   </button>

                                   <button type="button" className="button1 flex items-center justify-center" onClick={handleNextStep}>
                                       <div className="flex items-center space-x-2">
                                           <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
                                           <Image 
                                               src="/Arrow Right.svg" 
                                               width={23} 
                                               height={10} 
                                               alt="Continue Icon" 
                                           />
                                       </div>
                                   </button>
                               </div>

                               <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                   Already have an account? <span className="font-semibold"><Link href="/GENERAL/Login" className='underline'>Sign in</Link></span>
                               </p>

                           </form>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                              <div>          
                              {!showPersonalInfo ? (
                                  <div>
                                      <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                                          Would you like to fill out Personal Information Forms?
                                      </p>
                                      <div className="flex justify-end">
                                          <button className="button1 mt-7 flex items-center justify-center" onClick={handleShowPersonalInfo}>
                                              <div className="flex items-center space-x-2">
                                                  <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                      Yes
                                                  </p>
                                                  <Image
                                                      src="/Arrow Right.svg"
                                                      width={23}
                                                      height={10}
                                                      alt="Arrow Icon"
                                                  />
                                              </div>
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  // Display the PersonalInfo component
                                  <PersonalInfo/>
                              )}
                      
                              
                          
                              <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                  Already have an account? <span className="font-semibold"><Link href="/GENERAL/Login" className='underline'>Sign in</Link></span>
                              </p>
                          </div>
                        )}
                    </div>
                )}
            </div>
            <GeneralFooter />
        </div>
    );
}

