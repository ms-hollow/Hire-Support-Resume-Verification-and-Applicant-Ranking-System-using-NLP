import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";

const ReviewApplication = ({showEditButtons = true}) => {
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contact_number: "",
        complete: "",
        linkedin_profile: "",
    });

    const [documents, setDocuments] = useState({
        resume: "Resume.pdf",
        diploma: "Diploma.pdf",
        transcript: "Transcript.pdf",
        certificate: "Certificate.pdf",
        seminarCertificate: "SeminarCertificate.pdf",
        additional: "AdditionalDocument.pdf",
      });

    const getApplication = async () => {  
        const applicantData = localStorage.getItem('job_application_draft');
        if (applicantData) {
            
            const data = JSON.parse(applicantData);
    
            setFormData({
                fullName: data.fullName,
                email: data.email,
                contact_number: data.contact_number,
                complete: data.address,
                linkedin_profile: data.linkedin_profile,
            });
            
            // console.log(data);
        } else {
            console.log('No draft found');
        }
    };
    
    useEffect(() => {
        getApplication();
    }, []);


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

    return ( 
        <div>
            <section className=" pb-6">
                 <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">Personal Information</p>
                    {showEditButtons && (
                            <button className="flex items-center focus:outline-none">
                                <Link href="/APPLICANT/ApplicantProfile">
                                <Image
                                    src="/Edit Icon.svg"
                                    width={25}
                                    height={11}
                                    alt="Edit Icon"
                                />
                                </Link>
                            </button>
                        )}
                </div>
                <div className="w-full  rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse ">
                    <tbody>
                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Full Name:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{formData.fullName}</span></p>
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Email Address:<span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{formData.email}</span></p>
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Contact No.:<span id="" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{formData.contact_number}</span></p>
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Complete Address: <span id="" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">{formData.complete}</span></p>
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">LinkedIn Profile Link <span id="" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">{formData.linkedin_profile}</span></p>
                                
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </section>

            <section className=" pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">Uploaded Documents</p>
                    {showEditButtons && (
                        <button className="flex items-center focus:outline-none">
                            <Link href="/APPLICANT/ApplicantDocuments">
                            <Image
                                src="/Edit Icon.svg"
                                width={25}
                                height={11}
                                alt="Edit Icon"
                            />
                            </Link>
                        </button>
                    )}
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse ">
                    <tbody>
                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                            <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Resume:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.resume}</span></p>
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Educational Documents - Diploma:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.diploma}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Educational Documents - TOR:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.transcript}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Work Experience - Certificate of Employment:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.certificate}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Certifications- Seminar/Workshop/Skills Certificates:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.seminarCertificate}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">Additional Documents:<span id="" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">{documents.additional}</span></p>   
                            </td>
                        </tr>

                    </tbody>
                    </table>
                </div>
            </section>
        </div>
     );
}
 
export default ReviewApplication;