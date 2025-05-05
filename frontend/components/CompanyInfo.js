import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import phLocations from "@/public/placeHolder/philippines.json";
import {
    getCompanyProfile,
    updateCompanyProfile,
} from "@/pages/api/companyApi";
import { toast } from "react-toastify";
import ToastWrapper from "./ToastWrapper";
import apiBaseUrl from "@/config/apiBaseUrl";

const CompanyInfo = ({ isEditable, onUpdateComplete }) => {
    const { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [formData, setFormData] = useState({
        company_name: "",
        number_applicants: "",
        email: "",
        contact_number: "",
        job_industry: "",
        region: "",
        province: "",
        city: "",
        postal_code: "",
        barangay: "",
        present_address: "",
        linkedin_profile: "",
    });

    // Fetch company profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const profileData = await getCompanyProfile(authTokens);
            if (profileData) {
                setFormData(profileData);
            }
        };
        fetchProfile();
    }, [authTokens]);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData({ ...formData, contact_number: value });
        }
    };

    useEffect(() => {
        setRegions(phLocations);
    }, []);

    useEffect(() => {
        if (formData.region) {
            const selectedRegion = phLocations.find(
                (region) => region.id === formData.region
            );
            const provincesList = selectedRegion ? selectedRegion.p : [];
            setProvinces(provincesList);

            if (!provincesList.find((p) => p.n === formData.province)) {
                setFormData((prev) => ({
                    ...prev,
                    province: "",
                    city: "",
                    barangay: "",
                }));
                setCities([]);
                setBarangays([]);
            }
        }
    }, [formData.region]);

    useEffect(() => {
        if (formData.province) {
            const selectedProvince = provinces.find(
                (province) => province.n === formData.province
            );
            const cityList = selectedProvince ? selectedProvince.c : [];
            setCities(cityList);

            if (!cityList.find((c) => c.n === formData.city)) {
                setFormData((prev) => ({ ...prev, city: "", barangay: "" }));
                setBarangays([]);
            }
        }
    }, [formData.province, provinces]);

    useEffect(() => {
        if (formData.city) {
            const selectedCity = cities.find(
                (city) => city.n === formData.city
            );
            const barangayList = selectedCity ? selectedCity.b : [];
            setBarangays(barangayList);

            if (!barangayList.find((b) => b === formData.barangay)) {
                setFormData((prev) => ({ ...prev, barangay: "" }));
            }
        }
    }, [formData.city, cities]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens?.access) {
            console.error("No auth token, cannot update company profile.");
            return;
        }

        const success = await updateCompanyProfile(authTokens, formData);

        if (success) {
            if (typeof window !== "undefined") {
                const fullUrl = window.location.href;

                if (fullUrl === `${apiBaseUrl}/COMPANY/CompanyProfile`) {
                    toast.success("Company profile updated!");

                    if (onUpdateComplete) {
                        onUpdateComplete();
                    }

                    router.push("/COMPANY/CompanyProfile");
                } else if (fullUrl === `${apiBaseUrl}/COMPANY/CompanyInfo`) {
                    toast.success("Account successfully registered!");

                    setTimeout(() => {
                        router.push("/COMPANY/CompanyHome");
                    }, 2000); // 2 seconds delay
                } else {
                    toast.error(
                        "An unexpected error occurred. Please try again later."
                    );
                }
            }
        } else {
            toast.error("Error updating profile. See console for details.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">
                            Company Name
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                placeholder=""
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">
                            Industry/Sector
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall ${
                                    !isEditable
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : " text-fontcolor"
                                }`}
                                name="job_industry"
                                value={formData.job_industry}
                                required
                                onChange={handleChange}
                            >
                                <option value="" disabled selected hidden>
                                    Select Sector
                                </option>
                                <option value="IT">
                                    Information Technology (IT)
                                </option>
                                <option value="IT">
                                    Information System (IS)
                                </option>
                                <option value="Computer Science">
                                    Computer Science
                                </option>
                                <option value="Data Science">
                                    Data Science
                                </option>
                                <option value="Cybersecurity">
                                    Cybersecurity
                                </option>
                                <option value="Artificial Intelligence">
                                    Artificial Intelligence
                                </option>
                                <option value="Cloud Computing">
                                    Cloud Computing
                                </option>
                                <option value="Robotics">Robotics</option>
                                <option value="Bioinformatics">
                                    Bioinformatics
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">
                            No. of Employees
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="num_applicants"
                                value={formData.num_applicants}
                                placeholder=""
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            ></input>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">
                            Email Address
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                placeholder="applicant@gmail.com"
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            ></input>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small text-fontcolor pb-1 font-medium">
                            Contact No.
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex items-center">
                            <span className="pl-2 pr-1 text-fontcolor">
                                +63
                            </span>
                            <input
                                type="text"
                                name="contact_number"
                                value={formData.contact_number}
                                required
                                onChange={handlePhoneNumberChange}
                                maxLength="10"
                                placeholder="9XXXXXXXXX"
                                readOnly={!isEditable}
                                className={`flex-grow w-full px-2 py-1 outline-none rounded-xs 
                                    ${
                                        isEditable
                                            ? "text-fontcolor"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col flex-grow gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Region
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall 
                                    ${
                                        !isEditable
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "text-fontcolor"
                                    }`}
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled selected hidden>
                                    Select Region
                                </option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.n}{" "}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Province
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall 
                                    ${
                                        !isEditable
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "text-fontcolor"
                                    }`}
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required={formData.region}
                            >
                                <option value="" disabled selected hidden>
                                    Select Province
                                </option>
                                {provinces.map((province) => (
                                    <option key={province.n} value={province.n}>
                                        {province.n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col flex-grow pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            City/Municipality
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall 
                                    ${
                                        !isEditable
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "text-fontcolor"
                                    }`}
                                id="city"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                            >
                                <option value="" disabled selected hidden>
                                    Select City
                                </option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.n}>
                                        {city.n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col flex-grow gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Barangay
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-full mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall ${
                                    !isEditable
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "text-fontcolor"
                                }`}
                                id="barangay"
                                name="barangay"
                                value={formData.barangay}
                                required
                                onChange={handleChange}
                            >
                                <option value="" disabled selected hidden>
                                    Select Barangay
                                </option>
                                {barangays.map((barangay, index) => (
                                    <option key={index} value={barangay}>
                                        {barangay}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Postal Code
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                id="postal-code"
                                name="postal_code"
                                placeholder=""
                                required
                                value={formData.postal_code || ""}
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                            ${
                                isEditable
                                    ? "text-fontcolor"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                            ></input>
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-col mb:flex-col sm:flex-col xsm: flex-col flex-grow pb-5">
                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pb-1">
                        Lot, Block, Unit, Building, Floor, Street Name,
                        Subdivision
                    </p>
                    <div className="h-medium rounded-xs border-2 border-fontcolor flex ">
                        <input
                            type="complete"
                            id="present-address"
                            name="present_address"
                            placeholder=""
                            required
                            value={formData.present_address || ""}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            className={`flex-grow w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        ></input>
                    </div>

                    <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-medium pt-5">
                        LinkedIn Profile Link
                    </p>
                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                        <input
                            type="linkedin-link"
                            id="linkedin"
                            name="linkedin_profile"
                            placeholder=""
                            required
                            value={formData.linkedin_profile}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            className={`flex-grow w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        ></input>
                    </div>
                </div>

                <div className="flex justify-end">
                    {isEditable && (
                        <button
                            onClick={handleSubmit}
                            className="button1 mt-5 flex items-center justify-center"
                        >
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
            <ToastWrapper />
        </div>
    );
};

export default CompanyInfo;
