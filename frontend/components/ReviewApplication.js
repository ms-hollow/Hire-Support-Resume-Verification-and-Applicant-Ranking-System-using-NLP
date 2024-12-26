import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

const ReviewApplication = ({showEditButtons = true}) => {
    
    const [formData, setFormData] = useState({
        firstName: "Laica",
        lastName:"Ygot",
        middleName: "Dawal",
        email: "applicant@email.com",
        contact_number: "09123456789",
        sex: "Female",
        date_of_birth: "12/12/2000",
        age: "21",
        complete: "Metro Manila, Philippines",
        linkedin_profile: "https://linkedin-profile-Laica-yg",
    });

    const [documents, setDocuments] = useState({
        resume: "Resume.pdf",
        diploma: "Diploma.pdf",
        transcript: "Transcript.pdf",
        certificate: "Certificate.pdf",
        seminarCertificate: "SeminarCertificate.pdf",
        additional: "AdditionalDocument.pdf",
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
                <div className="w-full overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse ">
                    <tbody>
                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Full Name:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{formData.firstName} {formData.middleName} {formData.lastName}</span></p>
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Email Address:<span className="pl-2 font-semibold text-medium text-fontcolor ">{formData.email}</span></p>
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Contact No.:<span id="" className="pl-2 font-semibold text-medium text-fontcolor ">{formData.contact_number}</span></p>
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Complete Address: <span id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.complete}</span></p>
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">LinkedIn Profile Link <span id="" className="pl-2 font-semibold text-medium text-fontcolor">{formData.linkedin_profile}</span></p>
                                
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </section>

            <section className=" pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">Additional Documents</p>
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
                <div className="w-full overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse ">
                    <tbody>
                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                            <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Resume:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.resume}</span></p>
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Educational Documents - Diploma:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.diploma}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Educational Documents - TOR:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.transcript}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Work Experience - Certificate of Employment:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.certificate}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Certifications- Seminar/Workshop/Skills Certificates:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.seminarCertificate}</span></p>   
                            </td>
                        </tr>

                        <tr className="px-2 border-b border-[#F5F5F5]">
                            <td className="p-2 ">
                                <p className="flex items-center pl-2 font-thin text-medium text-fontcolor pb-1">Additional Documents:<span id="" className=" pl-2 font-semibold text-medium text-fontcolor ">{documents.additional}</span></p>   
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