import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function JobApplication () {

    let {authTokens} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { jobId } = router.query;

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

    //TODO Send draft job application and get the job application ID

    const savePersonalInfo = async (formData) => {
        try {
            const response = await fetch('/api/create-job-application/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('jobApplicationId', data.job_application_id);
                const application_id = sessionStorage.getItem('jobApplicationId');
                console.log(application_id);
            } else {
                console.error('Error saving personal info');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                    const profileData = data?.profile_data;
                    
                    // console.log(profileData);
                    if (profileData) {
                        const completeAddress = `${profileData.present_address}, ${profileData.barangay}, ${profileData.city}, ${profileData.region}`;
                        // console.log(completeAddress);
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

    const getTitleFromLocalStorage = () => {
        const jobTitle = localStorage.getItem('job_title');
        return jobTitle ? jobTitle : null; 
    };

    if (loading) {
        return <p className="text-accent">Loading... (temporary) </p>;
    } 

    const navigateToApplicantDocuments = () => {
        savePersonalInfo();
        router.push({
            pathname: '/APPLICANT/ApplicantDocuments',
            query: { jobId }, 
        });
    };
    
    return ( 
        <div>
            <ApplicantHeader/>
                <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-8 xsm:px-8 lg:px-20 py-8 mx-auto">
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall  text-fontcolor pb-1">You are Applying for </p>
                    <p className="font-semibold text-primary text-large pb-1">{getTitleFromLocalStorage() || 'No Job Title Available'}</p>
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