import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';

export default function Register() {
    const [step, setStep] = useState(1); // Tracks the current step
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

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

    return (
        <div>
            <GeneralHeader />
            <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-20 mx-auto">
                <div className="box-container px-10 py-10 pb-8">
                    <h1 className="lg:text-extralarge mb:text-extralarge sm:text-extralarge text-primary">Register</h1>
                    <p className="font-semibold lg:text-medium mb:text-medium sm:text-medium pb-1 text-fontcolor">
                        {step === 1 ? "Confirm Password" : step === 2 ?  "Register your personal information" : "Please review your personal information"}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center pb-7">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div
                                className={`relative h-1 rounded-full transition-all duration-300 ${
                                    step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
                                } bg-primary`}
                            ></div>
                        </div>
                    </div>

                    {step === 1 && (
                        // Step 1: Confirm Password
                        <form>
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Email Address</p>
                            <div className="h-11 rounded-xs border-2 border-fontcolor flex">
                                <input type="text" id="email-address" name="email" placeholder="applicant@gmail.com" required></input>
                            </div>

                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-medium">Password</p>
                            <div className="h-11 rounded-xs border-2 border-fontcolor flex">
                                <input type={showPassword ? 'text' : 'password'} id="password" name="password" required onChange={handleChange} />
                            </div>

                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-medium">Confirm Password</p>
                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                <input type={showPassword ? 'text' : 'password'} id="confirm-password" name="confirmPassword" required onChange={handleChange} />
                            </div>

                            <div className="flex justify-end">
                                <button className="button1 mt-12" onClick={handleNextStep}> 
                                    <div className="flex items-center space-x-2">
                                        <p className="lg:text-medium mb:text-medium sm:text-small xsm:text-small font-medium text-center">Continue</p>
                                        <Image 
                                            src="/Arrow Right.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Notification Icon" 
                                        />
                                    </div>
                                </button>
                            </div>
                            <p className="text-small text-fontcolor pt-4 pb-1 font-medium">
                                Don’t have an account? <span className="font-semibold"><Link href="/GENERAL/Login">Sign in</Link></span>
                            </p>
                        </form>
                    )}

                    {step === 2 && (
                        // Step 2: Register Information
                        <form>
                            <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">First Name</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="first-name" name="firstName" placeholder="" required></input>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Last Name</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="last-name" name="lastName" placeholder="" required></input>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:w-14 mb:flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">M.I.</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="mi" name="middleName" placeholder="" required></input>
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Sex</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <select className="valid:text-fontcolor invalid:text-placeholder lg:w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small " id="sex" name="sex" required/*onChange={handleChange}*/>
                                                    <option value=''disabled selected hidden> Select Sex</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Male">Male</option>   
                                                </select>
                                            </div>    
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Contact No.</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Date of Birth</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="birth-date" name="birthDate" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Age</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Region</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small" id="region" name="region" required>
                                            <option value='' disabled selected hidden>Select Region</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Region 1'>Region 1</option> 
                                            <option value='Region 2'>Region 2</option>   
                                            <option value='Region 3'>Region 3</option> 
                                            <option value='Region 4-A'>Region 4-A</option> 
                                            <option value='Region 4-B'>Region 4-B</option> 
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Province</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="province" name="province" required>
                                            <option value='' disabled selected hidden>Select Province</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Bulacan'>Bulacan</option>   
                                            <option value='Cavite'>Cavite</option>   
                                            <option value='Laguna'>Laguna</option>   
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow-0 lg:w-1/4 mb:w-full sm:w-full">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Postal Code</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="postal-code" name="postalCode" placeholder="" required></input>
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">City/Municipality</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="city" name="city" required/*onChange={handleChange}*/>
                                                    <option value=''  disabled selected hidden>Select City</option>
                                                    <option value='Quezon'>Quezon</option>
                                                    <option value='Manila'>Manila</option>   
                                                    <option value='Caloocan'>Caloocan</option> 
                                                    <option value='Las Pinas'>Las Pinas</option> 
                                                    <option value='Taguig'>Taguig</option> 
                                                    <option value='Paranaque'>Paranaque</option> 
                                                    <option value='Valenzeula'>Valenzeula</option> 
                                                    <option value='Malabon'>Malabon</option> 
                                                    <option value='Makati'>Makati</option> 
                                                </select>
                                            </div>
                                        
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Barangay</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="barangay" name="barangay" required/*onChange={handleChange}*/>
                                                <option value='' disabled selected hidden>Select Baranggay</option>
                                                <option value='Tandang Sora'>Tandang Sora</option>
                                                <option value='Ermita'>Ermita</option>   
                                            </select>
                                            </div>
                                    </div>      
                            </div>

                            <div className="flex lg:flex-col mb:flex-col sm:flex-col xsm: flex-col flex-grow pb-5">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-medium pb-1">Lot, Block, Unit, Building, Floor, Street Name, Subdivision</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                                        <input type="complete" id="state" name="complete" placeholder="" required /*onChange={handleChange}*/></input>
                                    </div>
                                    
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-medium pt-5">LinkedIn Profile Link</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="linkedin-link" id="state" name="linkedIn" placeholder="" required /*onChange={handleChange}*/></input>
                                    </div>
                            </div>

                            <div className="flex justify-between mt-12">
                                <button type="button" className="button2" onClick={handlePreviousStep}>
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-small xsm:text-small font-medium text-center">Back</p>
                                    </div>
                                </button>

                                <button type="button" className="button1" onClick={handleNextStep}>
                                    <div className="flex items-center space-x-2">
                                        <p className="lg:text-medium mb:text-medium sm:text-small xsm:text-small font-medium text-center">Continue</p>
                                        <Image 
                                            src="/Arrow Right.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Continue Icon" 
                                        />
                                    </div>
                                </button>
                            </div>

                            <p className="text-small text-fontcolor pt-4 pb-1 font-medium">
                                Don’t have an account? <span className="font-semibold"><Link href="/GENERAL/Login">Sign in</Link></span>
                            </p>

                        </form>
                    )}

                    {step === 3 && (
                        // Step 3: Review
                        <form>
                        <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">First Name</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="first-name" name="firstName" placeholder="" required /*onChange={handleChange}*/></input>
                                    </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Last Name</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="last-name" name="lastName" placeholder="" required /*onChange={handleChange}*/></input>
                                            </div>
                                    </div>
                                    <div className="flex flex-col lg:w-14 mb:flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">M.I.</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="mi" name="middleName" placeholder="" required /*onChange={handleChange}*/></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Email Address</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="email-address" name="email" placeholder="applicant@gmail.com" required /*onChange={handleChange}*/></input>
                                    </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Contact No.</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Sex</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small " id="sex" name="sex" required/*onChange={handleChange}*/>
                                                <option value=''disabled selected hidden> Select Sex</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>   
                                            </select>
                                        </div>    
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Date of Birth</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="birth-date" name="birthDate" placeholder="" required /*onChange={handleChange}*/></input>
                                            </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Age</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Region</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small" id="region" name="region" required>
                                            <option value='' disabled selected hidden>Select Region</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Region 1'>Region 1</option> 
                                            <option value='Region 2'>Region 2</option>   
                                            <option value='Region 3'>Region 3</option> 
                                            <option value='Region 4-A'>Region 4-A</option> 
                                            <option value='Region 4-B'>Region 4-B</option> 
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Province</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="province" name="province" required>
                                            <option value='' disabled selected hidden>Select Province</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Bulacan'>Bulacan</option>   
                                            <option value='Cavite'>Cavite</option>   
                                            <option value='Laguna'>Laguna</option>   
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow-0 lg:w-1/4 mb:w-full sm:w-full">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Postal Code</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="postal-code" name="postalCode" placeholder="" required></input>
                                    </div>
                                </div>
                        </div>

                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">City/Municipality</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="city" name="city" required/*onChange={handleChange}*/>
                                                <option value=''  disabled selected hidden>Select City</option>
                                                <option value='Quezon'>Quezon</option>
                                                <option value='Manila'>Manila</option>   
                                            </select>
                                        </div>
                                        

                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Barangay</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="barangay" name="barangay" required/*onChange={handleChange}*/>
                                                <option value='' disabled selected hidden>Select Baranggay</option>
                                                <option value='Tandang Sora'>Tandang Sora</option>
                                                <option value='Ermita'>Ermita</option>   
                                            </select>
                                            </div>
                                    </div>  
                        </div>

                        <div className="flex lg:flex-col mb:flex-col sm:flex-col xsm: flex-col flex-grow pb-5">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-medium pb-1">Lot, Block, Unit, Building, Floor, Street Name, Subdivision</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                                        <input type="complete" id="state" name="complete" placeholder="" required /*onChange={handleChange}*/></input>
                                    </div>
                                    
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-medium pt-5">LinkedIn Profile Link</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="linkedin-link" id="state" name="linkedIn" placeholder="" required /*onChange={handleChange}*/></input>
                                    </div>
                                
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-medium">Password</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="" required  onChange={handleChange} ></input>  
                                    </div>      

                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-medium">Confirm Password</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="" required  onChange={handleChange} ></input>  
                                    </div>   
                        
                                {/*checkbox*/}
                                <div className="flex pt-12 pb-5">
                                <input type="checkbox"value="" id="agreement" className="flex items-start h-5 w-8 "/>
                                <p className="text-fontcolor text-small items-center justify-center ml-5"> By creating an account or signing in, you understand and agree to our Terms. You also acknowledge our <span className="font-medium"> <Link href="" className="underline">Terms & Condition</Link></span> and <span className="font-medium"> <Link href="" className="underline">Privacy Policy</Link></span></p>      
                                </div>
                        
                        </div>
                            
                           <div className="flex justify-between mt-5">
                                <button type="button" className="button2" onClick={handlePreviousStep}>
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-small xsm:text-small font-medium text-center">Back</p>
                                    </div>
                                </button>

                                <Link href="/GENERAL/Login">
                                    <button type="button" className="button1" onClick={handleNextStep}>
                                        <div className="flex items-center space-x-2">
                                            <p className="lg:text-medium mb:text-medium sm:text-small xsm:text-small font-medium text-center">Register</p>
                                            <Image 
                                                src="/Arrow Right.svg" 
                                                width={23} 
                                                height={10} 
                                                alt="Continue Icon" 
                                            />
                                        </div>
                                    </button>
                                </Link>
                            </div>
                            
                            <p className="text-small text-fontcolor pt-4 pb-1 font-medium">
                                Don’t have an account? <span className="font-semibold"><Link href="/GENERAL/Login">Sign in</Link></span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
