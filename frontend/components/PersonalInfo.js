import { useState, useContext } from "react";
import Link from "next/link";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";

//! PENDING

const PersonalInfo = ({ showRegisterButton }) => {
    const { authTokens } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        contact_number: '',
        sex: '',
        date_of_birth: '',
        age: '',
        region: '',
        province: '',
        postalCode: '',
        city: '',
        barangay: '',
        complete: '',
        linkedin_profile: ''

    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return ( 
  
        <div>
                <form >
                        <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">First Name</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="first_name" name="firstName" placeholder="" required onChange={handleChange}></input>
                                    </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Last Name</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="last_name" name="lastName" placeholder="" required onChange={handleChange}></input>
                                            </div>
                                    </div>
                                    <div className="flex flex-col lg:w-14 mb:flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">M.I.</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="middle-name" name="middleName" placeholder="" required  onChange={handleChange}></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email Address</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="email-address" name="email" placeholder="applicant@gmail.com" required onChange={handleChange}></input>
                                    </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Contact No.</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="contact-number" name="contact_number" placeholder="" required onChange={handleChange}></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Sex</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="sex" name="sex" required onChange={handleChange}>
                                                <option value=''disabled selected hidden> Select Sex</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>   
                                            </select>
                                        </div>    
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Date of Birth</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="date" id="birth-date" name="date_of_birth" placeholder="" required onChange={handleChange}></input>
                                            </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Age</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="age" name="age" placeholder="" required onChange={handleChange}></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Region</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder w-full mb:w-full sm:w-full xsm:w-full lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="region" name="region" required>
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
                                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Province</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="province" name="province" required>
                                            <option value='' disabled selected hidden>Select Province</option>
                                            <option value='Metro Manila'>Metro Manila</option>
                                            <option value='Bulacan'>Bulacan</option>   
                                            <option value='Cavite'>Cavite</option>   
                                            <option value='Laguna'>Laguna</option>   
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow-0 lg:w-1/4 mb:w-full sm:w-full">
                                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Postal Code</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="text" id="postal-code" name="postalCode" placeholder="" required></input>
                                    </div>
                                </div>
                        </div>

                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">City/Municipality</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="city" name="city" required onChange={handleChange}>
                                                <option value=''  disabled selected hidden>Select City</option>
                                                <option value='Quezon'>Quezon</option>
                                                <option value='Manila'>Manila</option>   
                                            </select>
                                        </div>
                                        

                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Barangay</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="barangay" name="barangay" required onChange={handleChange}>
                                                <option value='' disabled selected hidden>Select Baranggay</option>
                                                <option value='Tandang Sora'>Tandang Sora</option>
                                                <option value='Ermita'>Ermita</option>   
                                            </select>
                                            </div>
                                    </div>  
                        </div>

                        <div className="flex lg:flex-col mb:flex-col sm:flex-col xsm: flex-col flex-grow pb-5">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pb-1">Lot, Block, Unit, Building, Floor, Street Name, Subdivision</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                                        <input type="complete" id="state" name="complete" placeholder="" required  onChange={handleChange}></input>
                                    </div>
                                    
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pt-5">LinkedIn Profile Link</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="linkedin-link" id="linkedin" name="linkedin_profile" placeholder="" required  onChange={handleChange}></input>
                                    </div>
                          
                        </div>
                            
                        <div className="flex justify-end">
                            {showRegisterButton && (
                                <button onClick={handleSubmit} className="button1 mt-5 flex items-center justify-center">
                                    <div className="flex items-center space-x-2">
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-small font-medium text-center">
                                        Register
                                    </p>
                                    <Image
                                        src="/Arrow Right.svg"
                                        width={23}
                                        height={10}
                                        alt="Notification Icon"
                                    />
                                    </div>
                            </button>
                            )}
                        </div>        
                </form>     
        </div>
  
     );
}
 
export default PersonalInfo;
