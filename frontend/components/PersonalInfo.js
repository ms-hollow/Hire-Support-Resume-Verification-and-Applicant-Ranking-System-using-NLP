import { useState, useContext, useEffect } from "react";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";
import jwt from 'jsonwebtoken';

//TODO Palagyan ako loader dito mi. Dapat mag-loload muna siya before mag mount
//TODO Pa-ayos ng list ng cities, municipality etc. Maganda sana automatic siya based sa napiling region or municipality
//TODO Palagyan ng conditions. Example, sa date dapat chinicheck yung year. 
//TODO Yung phone number din dapat maayos
//TODO Kayo na bahala kung ano pa pwede modify hehe

const PersonalInfo = ({ isEditable, onUpdateComplete }) => {
    const { authTokens } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        contact_number: '',
        sex: '',
        date_of_birth: '',
        age: '',
        region: '',
        province: '',
        postal_code: '',
        city: '',
        barangay: '',
        present_address: '',
        linkedin_profile: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = authTokens?.access; 
        if (!token) return;  

        try {
            const response = await fetch('http://127.0.0.1:8000/applicant/profile/edit/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Profile updated:", data);
                if (onUpdateComplete) {
                    onUpdateComplete();
                }
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        const token = authTokens?.access; 
        if (!token) return;

        const decodedToken = jwt.decode(token);
        // console.log(decodedToken);

        const getApplicantProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/applicant/profile/view/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const profileData = data.profile_data;
                    // console.log(profileData);
                    setFormData({
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        middle_name: profileData.middle_name,
                        email: decodedToken.email,
                        contact_number: profileData.contact_number,
                        sex: profileData.sex,
                        date_of_birth: profileData.date_of_birth,
                        age: profileData.age,
                        region: profileData.region,
                        province: profileData.province,
                        postal_code: profileData.postal_code,
                        city: profileData.city,
                        barangay: profileData.barangay,
                        present_address: profileData.present_address, 
                        linkedin_profile: profileData.linkedin_profile,
                    });
                    
                } else {
                    console.error('Failed to fetch applicant profile');
                }
            } catch (error) {
                console.error('Error fetching applicant profile:', error);
            }
        };
        getApplicantProfile();
    }, [authTokens]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">First Name</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                name="first_name" 
                                value={formData.first_name} 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Last Name</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                name="last_name" 
                                value={formData.last_name} 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className="flex flex-col lg:w-14 mb:flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">M.I.</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                name="middle_name" 
                                value={formData.middle_name} 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Email Address</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                name="email" 
                                value={formData.email} 
                                disabled 
                                required 
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Contact No.</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input 
                                type="text" 
                                name="contact_number" 
                                value={formData.contact_number} 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Sex</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="sex" name="sex" value={formData.sex} required onChange={handleChange}>
                                                <option value=''disabled selected hidden> Select Sex</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>   
                                            </select>
                                        </div>    
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Date of Birth</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="date" id="birth-date" name="date_of_birth" placeholder="" required value={formData.date_of_birth}  onChange={handleChange}></input>
                                            </div>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Age</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                                <input type="text" id="age" name="age" placeholder="" required value={formData.age}  onChange={handleChange}></input>
                                            </div>
                                    </div>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                                <div className="flex flex-col flex-grow">
                                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Region</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <select className="valid:text-fontcolor invalid:text-placeholder w-full mb:w-full sm:w-full xsm:w-full lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="region" name="region" value={formData.region}  onChange={handleChange} required>
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
                                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="province" name="province" value={formData.province}  onChange={handleChange} required>
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
                                        <input type="text" id="postal-code" name="postal_code" placeholder="" required value={formData.postal_code || ''}  onChange={handleChange}></input>
                                    </div>
                                </div>
                        </div>

                        <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                            <div className="flex flex-col flex-grow">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">City/Municipality</p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="city" name="city" required value={formData.city}  onChange={handleChange}>
                                                <option value=''  disabled selected hidden>Select City</option>
                                                <option value='Quezon'>Quezon</option>
                                                <option value='Manila'>Manila</option>   
                                            </select>
                                        </div>
                                        

                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Barangay</p>
                                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-small mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="barangay" name="barangay" value={formData.barangay}  required onChange={handleChange}>
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
                                        <input type="complete" id="present-address" name="present_address" placeholder="" required value={formData.present_address || ''}  onChange={handleChange}></input>
                                    </div>
                                    
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pt-5">LinkedIn Profile Link</p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input type="linkedin-link" id="linkedin" name="linkedin_profile" placeholder="" required value={formData.linkedin_profile} onChange={handleChange}></input>
                                    </div>
                          
                        </div>
                            
                        <div className="flex justify-end">
                            {isEditable && (
                                <button onClick={handleSubmit} className="button1 mt-5 flex items-center justify-center">
                                <div className="flex items-center space-x-2">
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-small font-medium text-center">
                                    {isEditable ? "Update" : "Register"}
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
