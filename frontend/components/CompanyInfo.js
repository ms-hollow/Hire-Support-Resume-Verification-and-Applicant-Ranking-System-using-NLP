import { useState, useContext, useEffect } from "react";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

const CompanyInfo = ({ isEditable, onUpdateComplete }) => {

    const { authTokens } = useContext(AuthContext);
    const router = useRouter();

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [formData, setFormData] = useState({
        company_name: '',
        num_applicants: '',
        email: '',
        contact_number: '',
        job_industry: '',
        region: '',
        province: '',
        city: '',
        postal_code: '',
        barangay: '',
        present_address: '',
        linkedin_profile: ''
    });

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData({ ...formData, contact_number: value });
        }
    };

    const handleChange = (e) => {
        
        const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };

        const { region, province, city, barangay } = formData;

        useEffect(() => {
            fetch("https://psgc.gitlab.io/api/regions/")
                .then((res) => res.json())
                .then((data) => setRegions(data))
                .catch((err) => console.error("Error fetching regions:", err));
        }, []);

        useEffect(() => {
            if (region) {
                if (region === "130000000") {
                    setProvinces([]);
                    fetch(`https://psgc.gitlab.io/api/regions/${region}/cities-municipalities/`)
                        .then((res) => res.json())
                        .then((data) => setCities(data))
                        .catch((err) => console.error("Error fetching cities for NCR:", err));
                    setFormData({ ...formData, province: "", city: "" });
                } else {
                    fetch(`https://psgc.gitlab.io/api/regions/${region}/provinces/`)
                        .then((res) => res.json())
                        .then((data) => setProvinces(data))
                        .catch((err) => console.error("Error fetching provinces:", err));
                    setCities([]);
                }
            } else {
                setProvinces([]);
                setCities([]);;
                setBarangays([]);

            }
        }, [region]);

        useEffect(() => {
            if (province && region !== "130000000") {
                fetch(`https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`)
                    .then((res) => res.json())
                    .then((data) => setCities(data))
                    .catch((err) => console.error("Error fetching cities:", err));
            } else if (region !== "130000000") {
                setCities([]);
            }
        }, [province, region]);

        useEffect(() => {
            if (city) {
                fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`)
                    .then((res) => res.json())
                    .then((data) => setBarangays(data))
                    .catch((err) => console.error("Error fetching barangays:", err));
            }
        }, [city], [barangay]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = authTokens?.access;
        if (!token) return;
    
        const updatedFormData = {
            company_name: formData.company_name,
            number_applicants: formData.num_applicants,
            contact_number: formData.contact_number,
            job_industry: formData.job_industry,
            region: formData.region,
            province: formData.province,
            city: formData.city,
            postal_code: formData.postal_code,
            barangay: formData.barangay,
            present_address: formData.present_address,
            linkedin_profile: formData.linkedin_profile
        };
    
        // console.log("Updated Form Data:", updatedFormData);
    
        try {
            const res = await fetch('http://127.0.0.1:8000/company/profile/edit/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                alert('Company profile updated!');
                setFormData(data);
                if (onUpdateComplete) {
                    onUpdateComplete();
                }
                validate(); // check kung anong page for redirect
            } else {
                alert("Error updating profile. See console for details.");
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };    

    const validate = async () => {
        if (typeof window !== "undefined") {

            const fullUrl = window.location.href;
            // console.log("Full URL:", fullUrl);
    
            if (fullUrl === 'http://localhost:3000/COMPANY/CompanyProfile') {
                router.push("/COMPANY/CompanyProfile");
            } else if (fullUrl === 'http://localhost:3000/GENERAL/Register' ) {
                router.push("/COMPANY/CompanyHome");
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };
        
    useEffect(() => {        

        const token = authTokens?.access;
        if (!token) return;

        const decodedToken = jwt.decode(token);
        // console.log(decodedToken);
    
        const getCompanyProfile = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/company/profile/view/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (res.ok) {
                    const data = await res.json();
                    // console.log("Company Profile Data:", data);
                    const profileData = data.profile_data;

                    setFormData({
                        company_name: profileData.company_name,
                        num_applicants: profileData.number_applicants,
                        email: decodedToken.email,
                        contact_number: profileData.contact_number,
                        job_industry: profileData.job_industry,
                        region: profileData.region,
                        province: profileData.province,
                        city: profileData.city,
                        postal_code: profileData.postal_code,
                        barangay: profileData.barangay,
                        present_address: profileData.present_address,
                        linkedin_profile: profileData.linkedin_profile
                    });
                    
                } else {
                    console.error(`Error fetching company profile: ${res.status} - ${res.statusText}`);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        };
    
        getCompanyProfile();
    }, [authTokens]);
    

  
    return ( 
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Company Name</p>
                            <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                <input type="text" name="company_name" value={formData.company_name} placeholder="" required onChange={handleChange}></input>
                            </div>
                    </div>        
                </div>
                <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Industry/Sector</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"  name="job_industry" value={formData.job_industry} required onChange={handleChange}>
                                <option value=''  disabled selected hidden>Select Sector</option>
                                <option value='IT'>Information Technology (IT)</option>
                                <option value='IT'>Information System (IS)</option>
                                <option value='Computer Science'>Computer Science</option>   
                                <option value="Data Science">Data Science</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Artificial Intelligence">Artificial Intelligence</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="Robotics">Robotics</option>
                                <option value="Bioinformatics">Bioinformatics</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">No. of Employees</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input type="text" name="num_applicants" value={formData.num_applicants} placeholder="" required onChange={handleChange}></input>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row sm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Email Address</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input type="text"  name="email" value={formData.email} placeholder="applicant@gmail.com" required onChange={handleChange} disabled></input>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">Contact No.</p>
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
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="province" name="province" value={formData.province}  onChange={handleChange}   required={region !== '130000000'}  disabled={region === '130000000'}>
                                <option value="province" disabled selected hidden>Select Province</option>
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
                            <input type="text"  name="postal_code" value={formData.postal_code} placeholder="" required onChange={handleChange}></input>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row sm:flex-col flex-grow gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">City/Municipality</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="city" name="city" required value={formData.city}  onChange={handleChange}>
                                <option value="city" disabled selected hidden>Select City</option>
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
                            <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" id="barangay" name="barangay" required value={formData.barangay}  onChange={handleChange}>
                                <option value="barangay" disabled selected hidden>Select Barangay</option>
                                {barangays.map((city) => (
                                    <option key={city.code} value={city.code}>
                                        {city.name}
                                    </option>
                                ))}  
                            </select>
                        </div>
                    </div>  
                </div>

                <div className="flex lg:flex-col mb:flex-col sm:flex-col xsm: flex-col flex-grow pb-5">
                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pb-1">Lot, Block, Unit, Building, Floor, Street Name, Subdivision</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                            <input type="complete"  name="present_address" value={formData.present_address} placeholder="" required onChange={handleChange}></input>
                        </div>
                        
                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pt-5">LinkedIn Profile Link</p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input type="linkedin-link"  name="linkedin_profile" value={formData.linkedin_profile} placeholder="" required onChange={handleChange}></input>
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
 
export default CompanyInfo;