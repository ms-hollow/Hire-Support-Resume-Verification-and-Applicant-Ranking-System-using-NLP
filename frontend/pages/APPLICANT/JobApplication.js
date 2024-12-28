import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { useAddressMapping } from "@/pages/utils/AddressMapping";
import { useJobContext } from "../context/JobContext";

export default function JobApplication () {

        let {authTokens} = useContext(AuthContext);
        const { jobDetails } = useJobContext();
        
        const [loading, setLoading] = useState(false);
        const router = useRouter();
        const { jobId } = router.query;
        const { convertAddressCodes } = useAddressMapping();

        const [formData, setFormData] = useState({
            firstName: '',
            lastName:'',
            middleName: '',
            email: '',
            contact_number: '',
            sex: '',
            date_of_birth: '',
            age: '',
            complete: '',
            linkedin_profile: '',
        });
    
        const [step, setStep] = useState(1);
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            const updatedData = { ...formData, [name]: value };
            setFormData(updatedData);
    
            const fields = Object.keys(formData);
            const filledFields = fields.filter((field) => formData[field] || updatedData[field]);
            setStep(Math.min(filledFields.length, fields.length));
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            const response = await fetch("/api/submit-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            alert(result.message);
        };
    
        const handleEdit = () => {
            alert("Edit button clicked - implement your logic here.");
        };

        useEffect(() => {
            if (!authTokens?.access) {
                console.log("No access token found");
                return;
            }

            const decodedToken = jwt.decode(authTokens.access);
            // console.log("Decoded token:", decodedToken);
            
            if (!decodedToken) {
                console.log("Invalid or expired token");
                return;
            }

            const getApplicantInfo = async () => {
                try {
                    const res = await fetch('https://hire-support-resume-verification-and.onrender.com/applicant/profile/view/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authTokens.access}`,
                            'Content-Type': 'application/json',
                        },
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        // console.log("API Response:", data);

                    const profileData = data?.profile_data;
                    // console.log(profileData);

                    // Ensure that profile_data exists before trying to access the address components
                    if (profileData) {
                        
                        const { city, province, region, barangay } = profileData;
                        const addressNames = convertAddressCodes(region, province, city, barangay);
                        // console.log("converted", addressNames);
                        const completeAddress = `${profileData.present_address}, ${addressNames.barangayName}, ${addressNames.cityName}, ${addressNames.provinceName}, ${addressNames.regionName}`;
                        // console.log("Complete Address:", completeAddress);

                        setFormData({
                            firstName: profileData.first_name,
                            lastName: profileData.last_name,
                            middleName: profileData.middle_name,
                            email: decodedToken.email,
                            contact_number: profileData.contact_number,
                            sex: profileData.sex,
                            date_of_birth: profileData.date_of_birth,
                            age: profileData.age,
                            complete: completeAddress,
                            linkedin_profile: profileData.linkedin_profile,
                        });
                        
                    } else {
                        console.error("Profile data not found in the response.");
                    }
                    
                    } else {
                        console.error("Failed to fetch applicant info, status:", res.status);
                    }
                } catch (error) {
                    console.error("Error fetching applicant info:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            getApplicantInfo();
        }, [authTokens]);

        const navigateToApplicantDocuments = () => {
            router.push({
                pathname: '/APPLICANT/ApplicantDocuments',
                query: { jobId }, 
            });
        };
            
        if (loading) {
            return <p>Loading...</p>;
        }
    
        if (!jobDetails) {
            return <p>No job details found.</p>;
        }

    return ( 
        <div>
            <ApplicantHeader/>
                <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-8 xsm:px-8 lg:px-20 py-8 mx-auto">
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall  text-fontcolor pb-1">You are Applying for </p>
                    <p className="font-semibold text-primary text-large pb-1">{jobDetails.job_title || 'No job title available'}</p>
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">Company</p>
                    <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-8 font-bold underline"> See job hiring details</p>
                    
                    <div className="flex items-center justify-center ">
                        <div className="box-container px-8 py-5 mx-auto">
                            <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">Personal Information</p>

                            <div className="flex items-center pt-2">
                                <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                    <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "25%" }}></div>
                                </div>
                            </div>


                            <div className="pt-8 pb-6">
                                <div className="w-full overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                                    <table className="w-full border-collapse">
                                    <tbody>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2 ">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Full Name</p>
                                            <p id="" className=" pl-2 font-semibold text-medium text-fontcolor">{formData.firstName} {formData.middleName} {formData.lastName}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2 ">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Email Address</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.email}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Contact No.</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.contact_number}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Sex</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.sex}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Date of Birth</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.date_of_birth}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Age</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.age}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">Complete Address</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.complete}</p>
                                        </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                        <td className="p-2">
                                            <p className="pl-2 font-thin text-medium text-fontcolor">LinkedIn Profile Link</p>
                                            <p id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.linkedin_profile}</p>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-between mt-1">
                                
                                <button type="button" className="button2 flex items-center justify-center">
                                    <Link href="/APPLICANT/ApplicantProfile" className="ml-auto">
                                        <div className="flex items-center space-x-2">
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Edit   </p>
                                        </div>
                                    </Link>
                                </button>
                                

                                <button onClick={navigateToApplicantDocuments} type="button" className="button1 flex items-center justify-center">  
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
                
                        </div>
                    </div>
                </div>
            <GeneralFooter/>
        </div>
     );
}