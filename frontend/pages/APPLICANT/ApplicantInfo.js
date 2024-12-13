import { useState } from "react";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";

export default function ApplicantInfo() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        sex: "Male",
        dob: "",
        age: "",
        address: "",
        linkedIn: "",
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
            <ApplicantHeader />

            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-20 xsm:px-20 lg:px-20 mx-auto">
                <h1 className="text-xl font-bold text-primary pb-5">Job Title</h1>

                {/* Form Box */}
                <div className="box-container p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto mt-6">
                    <h1 className="text-xl font-bold text-primary pb-5">Personal Information</h1>
                    <form onSubmit={handleSubmit}>

                        {/* Progress Bar */}
                        <div className="relative w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div className="absolute bg-[var(--primary)] h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            />
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="someone@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                placeholder="+123456789"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            />
                        </div>

                        {/* Sex */}
                        <div>
                            <label className="block text-gray-700 font-sansm mt-2">Sex</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">Complete Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street, City, Country"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            ></input>
                        </div>

                        {/* LinkedIn Profile */}
                        <div>
                            <label className="block text-gray-700 font-sans mt-2">LinkedIn Profile</label>
                            <input
                                type="url"
                                name="linkedIn"
                                placeholder="https://linkedin.com/in/your-profile"
                                value={formData.linkedIn}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md bg-[var(--background)] border py-2 px-3"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-between">
                          <button
                              type="button"
                              onClick={handleEdit}
                            className="rounded-lg py-2 px-6 bg-[var(--secondary)] text-[var(--fontcolor)] transition-all duration-300 hover:shadow-md hover:shadow-gray-400"
                        >
                          Edit
                  </button>
                          <button
                             type="submit"
                              className="rounded-lg py-2 px-6 bg-[var(--primary)] text-[var(--foreground)] transition-all duration-300 hover:shadow-md hover:shadow-gray-400"
                        >
                      Continue
                 </button>
                        </div>
                    </form>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
