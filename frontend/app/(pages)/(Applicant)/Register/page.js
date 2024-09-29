"use client"
import Image from 'next/image';
import Link from "next/link";
import { FiEye, FiEyeOff } from 'react-icons/fi'; /*npm install react-icons*/

import { useState } from 'react';


export default function Register() {
/* const{ router } = useRouter()*/
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


    return (
        <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-5 sm:p-12 xsm:p-14 py-20 mx-auto">
            <div className="box-container px-10 py-10 pb-8 ">
                <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">Register</h1>

                <form>
                    <div className="flex lg:flex-row sm: flex flex-col gap-5 pb-5">
                        <div className="flex flex-col flex-grow">
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">First Name</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                    <input type="text" id="first-name" name="firstName" placeholder="" required /*onChange={handleChange}*/></input>
                                </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Last Name</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                            <input type="text" id="last-name" name="lastName" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                                <div className="flex flex-col lg:w-14 mb:flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">M.I.</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                            <input type="text" id="mi" name="middleName" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                    </div>
                    <div className="flex lg:flex-row sm: flex flex-col gap-5 pb-5">
                        <div className="flex flex-col flex-grow">
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Email Address</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                    <input type="text" id="email-address" name="email" placeholder="" required /*onChange={handleChange}*/></input>
                                </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Contact No.</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                            <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                    </div>
                    <div className="flex lg:flex-row sm: flex flex-col flex-grow gap-5 pb-5">
                        <div className="flex flex-col flex-grow">
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Sex</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small " id="sex" name="sex" required/*onChange={handleChange}*/>
                                            <option value=''disabled selected hidden> Select Sex</option>
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>   
                                        </select>
                                    </div>    
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Date of Birth</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="birth-date" name="birthDate" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Age</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="contact-number" name="contactNum" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                    </div>
                    <div className="flex lg:flex-row sm: flex flex-col flex-grow gap-5 pb-5">
                        <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Country/Region</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-small sm:text-small xsm:text-small" id="country" name="country" required/*onChange={handleChange}*/>
                                                <option value='' disabled selected hidden>Select Country</option>
                                                <option value='Philippines'>Philippines</option>
                                                <option value='Europe'>Europe</option>   
                                            </select>
                                        </div>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">State/Province</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                        <select  className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="state" name="state" required/*onChange={handleChange}*/>
                                            <option value=''disabled selected hidden>Select State</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Pegion 1'>Region 1</option>   
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Postal Code</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input type="text" id="postal-code" name="postalCode" placeholder="" required /*onChange={handleChange}*/></input>
                                        </div>
                                </div>
                    </div>

                    <div className="flex lg:flex-row sm: flex flex-col flex-grow gap-5 pb-5">
                        <div className="flex flex-col flex-grow">
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">City/Municipality</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-small sm:text-small xsm:text-small" id="city" name="city" required/*onChange={handleChange}*/>
                                            <option value=''  disabled selected hidden>Select City</option>
                                            <option value='Quezon'>Quezon</option>
                                            <option value='Manila'>Manila</option>   
                                        </select>
                                    </div>
                                    

                                </div>
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-semibold">Barangay</p>
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
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-semibold pb-1">Lot, Block, Unit, Building, Floor, Street Name, Subdivision</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                                    <input type="complete" id="state" name="complete" placeholder="" required /*onChange={handleChange}*/></input>
                                </div>
                                
                            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor font-semibold pt-5">LinkedIn Profile Link</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input type="linkedin-link" id="state" name="linkedIn" placeholder="" required /*onChange={handleChange}*/></input>
                                </div>
                            
                             <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-semibold">Password</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="" required  onChange={handleChange} ></input>  
                                </div>      

                             <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small pt-4 pb-1 text-fontcolor font-semibold">Confirm Password</p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor h-10 flex">
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="" required  onChange={handleChange} ></input>  
                                </div>   
                     
                            {/*checkbox*/}
                            <div className="flex pt-12 pb-12">
                            <input type="checkbox"value="" id="agreement" className="flex items-start h-5 w-8 "/>
                            <p className="text-fontcolor text-small items-center justify-center ml-5"> By creating an account or signing in, you understand and agree to our Terms. You also acknowledge our <span className="font-medium"> <Link href="" className="underline">Terms & Condition</Link></span> and <span className="font-medium"> <Link href="" className="underline">Privacy Policy</Link></span></p>      
                            </div>
                    
                    </div>
     
                    <button className="button1 flex items-center w-full p-5 pt-8">
                        <p className="lg:text-large mb:text-medium sm:text-small xsm:text-small text-center">Register</p>
                    </button>  
                    
                    <p className="text-small text-fontcolor pt-4 pb-1 font-medium">Don’t have an account? <span className="font-semibold"><Link href="/login" >Sign in</Link></span></p> 
                
                </form>
            </div> 

        </div>
    );
}

