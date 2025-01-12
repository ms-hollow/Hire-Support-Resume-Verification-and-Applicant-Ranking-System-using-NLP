import { useState, useContext, useEffect } from "react";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

//! After mag fill-up, mareredirect na sa Applicant Home

const PersonalInfo = ({ isEditable, onUpdateComplete }) => {
    const { authTokens } = useContext(AuthContext);
    const router = useRouter();
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

    const handleDateOfBirthChange = (event) => {
        const birthDate = new Date(event.target.value);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const birthYear = birthDate.getFullYear();
    
        const age = currentYear - birthYear - (currentDate < new Date(birthDate.setFullYear(currentYear)) ? 1 : 0);
    
    
        if (birthYear > currentYear) {
            alert("The year entered exceeds the current year.");
            return;
        }
    
        if (age < 15) {
            alert("Age must be 15 years or older.");
            return;
        }
    
        if (age > 85) {
            alert("Age must be less than 85 years old.");
            return;
        }
    
        setFormData({
            ...formData,
            date_of_birth: event.target.value,
            age: age,
        });
    };
    
    const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 85);
    

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData({ ...formData, contact_number: value });
        }
    };

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/regions/")
            .then((res) => res.json())
            .then((data) => setRegions(data))
            .catch((err) => console.error("Error fetching regions:", err));
    }, []);

    useEffect(() => {
        if (formData.region) {
            if (formData.region === '130000000') { 
                setProvinces([]); 
                fetch(`https://psgc.gitlab.io/api/regions/${formData.region}/cities-municipalities/`)
                    .then((res) => res.json())
                    .then((data) => {
                        setCities(data);
                        setFormData({ ...formData, province: '', city: '', barangay: '' }); 
                    })
                    .catch((err) => console.error("Error fetching cities for NCR:", err));
            } else {
                fetch(`https://psgc.gitlab.io/api/regions/${formData.region}/provinces/`)
                    .then((res) => res.json())
                    .then((data) => setProvinces(data))
                    .catch((err) => console.error("Error fetching provinces:", err));
                setCities([]); 
            }
        } else {
            setProvinces([]);
            setCities([]);
            setBarangays([]);
        }
    }, [formData.region]);
    
    useEffect(() => {
        if (formData.province && formData.region !== '130000000') { 
            fetch(`https://psgc.gitlab.io/api/provinces/${formData.province}/cities-municipalities/`)
                .then((res) => res.json())
                .then((data) => setCities(data))
                .catch((err) => console.error("Error fetching cities:", err));
        } else if (formData.region !== '130000000') {
            setCities([]);
        }
    }, [formData.province, formData.region]);
    

    useEffect(() => {
        if (formData.city) {
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${formData.city}/barangays/`)
                .then((res) => res.json())
                .then((data) => setBarangays(data))
                .catch((err) => console.error("Error fetching barangays:", err));
        } else {
            setBarangays([]);
        }
    }, [formData.city]);

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
 
        // Remove the province field if the region is NCR
        const regiondata = { ...formData };
        if (formData.region === '130000000') {
            delete regiondata.province;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/applicant/profile/edit/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regiondata),
            });
    
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                if (onUpdateComplete) {
                    onUpdateComplete();
                }
                router.push("/APPLICANT/ApplicantHome");
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
    
    //* Retrieve and display applicant profile
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
                    <div className="flex flex-col flex-shrink-0">
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
                    <div className="flex flex-col flex-shrink">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Contact No.</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex items-center">
                            <span className="pl-2 pr-1 text-fontcolor">+63</span> 
                            <input 
                                type="text" 
                                name="contact_number" 
                                value={formData.contact_number} 
                                required 
                                onChange={handlePhoneNumberChange} 
                                maxLength="10" 
                                placeholder="9XXXXXXXXX" 
                                className="flex-grow outline-none" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Sex</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="sex" name="sex" value={formData.sex} required onChange={handleChange}>
                                <option value=''disabled selected hidden> Select Sex</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>   
                            </select>
                        </div>    
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Date of Birth</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input type="date" id="birth-date" name="date_of_birth"  required value={formData.date_of_birth} min={minDate.toISOString().split("T")[0]}  max={new Date().toISOString().split("T")[0]}  onChange={handleDateOfBirthChange} />
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Age</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input  type="text"  id="age"  name="age"  placeholder="15+" value={formData.age}  readOnly />
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Region</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select className="valid:text-fontcolor invalid:text-placeholder w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="region" name="region" value={formData.region}  onChange={handleChange}  required>
                            <option value="" disabled selected hidden>Select Region</option>
                                {regions.map((region) => (
                                    <option key={region.code} value={region.code}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Province</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="province" name="province" value={formData.province}  onChange={handleChange}   required={formData.region !== '130000000'}  disabled={formData.region === '130000000'} >
                            <option value="" disabled selected hidden>Select Province</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
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
                                <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="city" name="city" required value={formData.city}  onChange={handleChange}>
                                    <option value="" disabled selected hidden>Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.code} value={city.code}>
                                                {city.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">Barangay</p>
                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="barangay" name="barangay" value={formData.barangay}  required onChange={handleChange}>
                                    <option value="" disabled selected hidden>Select Barangay</option>
                                    {barangays.map((barangay) => (
                                        <option key={barangay.code} value={barangay.code}>
                                            {barangay.name}
                                        </option>
                                    ))}
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
                                    {isEditable ? "Continue" : "Register"}
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
