import { useState, useContext, useEffect } from "react";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";
import jwt from 'jsonwebtoken';

//TODO Palagyan ako loader dito mi. Dapat mag-loload muna siya before mag mount
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
        // Fetch regions
        const fetchRegions = async () => {
            try {
                const res = await fetch("https://psgc.gitlab.io/api/regions/");
                const data = await res.json();
                setRegions(data);
            } catch (err) {
                console.error("Error fetching regions:", err);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        // Fetch provinces if region is selected
        const fetchProvincesAndCities = async () => {
            if (!formData.region) return;
            
            try {
                if (formData.region === '130000000') {
                    // If NCR, fetch cities directly
                    setProvinces([]); 
                    const resCities = await fetch(`https://psgc.gitlab.io/api/regions/${130000000}/cities-municipalities/`);
                    const dataCities = await resCities.json();
                    setCities(dataCities);
                } else {
                    // Otherwise fetch provinces and cities
                    const resProvinces = await fetch(`https://psgc.gitlab.io/api/regions/${formData.region}/provinces/`);
                    const dataProvinces = await resProvinces.json();
                    setProvinces(dataProvinces);
                    setCities([]); // Clear cities as they depend on the province
                }
            } catch (err) {
                console.error("Error fetching provinces or cities:", err);
            }
        };
        fetchProvincesAndCities();
    }, [formData.region]);

    useEffect(() => {
        // Fetch cities if province is selected
        const fetchCitiesAndBarangays = async () => {
            if (!formData.province) return;

            try {
                const resCities = await fetch(`https://psgc.gitlab.io/api/provinces/${formData.province}/cities-municipalities/`);
                const dataCities = await resCities.json();
                setCities(dataCities);
                setBarangays([]); // Clear barangays as they depend on the city
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        };
        fetchCitiesAndBarangays();
    }, [formData.province]);

    useEffect(() => {
        // Fetch barangays if city is selected
        const fetchBarangays = async () => {
            if (!formData.city) return;

            try {
                const resBarangays = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${formData.city}/barangays/`);
                const dataBarangays = await resBarangays.json();
                setBarangays(dataBarangays);
            } catch (err) {
                console.error("Error fetching barangays:", err);
            }
        };
        fetchBarangays();
    }, [formData.city]);

    // Helper function to get the name by code
    const getNameByCode = (code, dataset) => {
        const item = dataset.find((entry) => entry.code === code);
        return item ? item.name : "Unknown"; // Default to "Unknown" if not found
    };

    // Convert codes to names before saving
    const convertAddressCodes = () => {
        const regionName = getNameByCode(formData.region, regions);
        const provinceName = getNameByCode(formData.province, provinces);
        const cityName = getNameByCode(formData.city, cities);
        const barangayName = getNameByCode(formData.barangay, barangays);

        return {
            regionName,
            provinceName,
            cityName,
            barangayName,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const addressNames = convertAddressCodes();

        const dataToSave = {
            ...formData,
            region: addressNames.regionName,
            province: addressNames.provinceName,
            city: addressNames.cityName,
            barangay: addressNames.barangayName,
        };

        console.log(dataToSave);

        const token = authTokens?.access; 
        if (!token) return;  

        try {
            const response = await fetch('https://hire-support-resume-verification-and.onrender.com/applicant/profile/edit/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave), // Send the updated data with names
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

        const getApplicantProfile = async () => {
            try {
                const response = await fetch('https://hire-support-resume-verification-and.onrender.com/applicant/profile/view/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const profileData = data.profile_data;
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



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="province" name="province" value={formData.province}  onChange={handleChange}   required={!formData.region || formData.region !== 'NCR'}  disabled={formData.region === 'NCR'} >
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