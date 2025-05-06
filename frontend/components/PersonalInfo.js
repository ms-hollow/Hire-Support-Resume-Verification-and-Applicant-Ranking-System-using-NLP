import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import phLocations from "@/public/placeHolder/philippines.json";
import {
    fetchApplicantProfile,
    updateApplicantProfile,
} from "@/pages/api/applicantApi";
import { toast } from "react-toastify";
import ToastWrapper from "./ToastWrapper";
import apiBaseUrl from "@/config/apiBaseUrl";

const PersonalInfo = ({ isEditable, onUpdateComplete }) => {
    const { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        contact_number: "",
        sex: "",
        date_of_birth: "",
        age: "",
        region: "",
        province: "",
        postal_code: "",
        city: "",
        barangay: "",
        present_address: "",
        linkedin_profile: "",
    });

    const handleDateOfBirthChange = (event) => {
        const value = event.target.value;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return;
        }

        const birthDate = new Date(value);
        if (isNaN(birthDate)) return;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const birthYear = birthDate.getFullYear();

        if (birthYear > currentYear) {
            toast.error("The year exceeds the current year.");
            return;
        }

        const birthDateThisYear = new Date(birthDate);
        birthDateThisYear.setFullYear(currentYear);

        const age =
            currentYear - birthYear - (currentDate < birthDateThisYear ? 1 : 0);

        if (age < 15) {
            toast.info("Age must be 15 years or older.");
            return;
        }

        if (age > 85) {
            toast.error("Age must be less than 85 years old.");
            return;
        }

        setFormData({
            ...formData,
            date_of_birth: value,
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens?.access) {
            console.error("No auth token, cannot update profile.");
            return;
        }

        const success = await updateApplicantProfile(authTokens, formData);

        if (success) {
            if (typeof window !== "undefined") {
                const fullUrl = window.location.href;

                if (
                    fullUrl ===
                    `http://localhost:3000/APPLICANT/ApplicantProfile`
                ) {
                    toast.success("Profile updated successfully!");

                    // Fetch updated profile after successful update
                    const updatedData = await fetchApplicantProfile(authTokens);
                    if (updatedData) {
                        setFormData(updatedData);
                    }

                    if (onUpdateComplete) {
                        onUpdateComplete();
                    }

                    router.push("/APPLICANT/ApplicantProfile");
                } else if (
                    fullUrl ===
                    `http://localhost:3000/APPLICANT/ApplicantRegister`
                ) {
                    toast.success("Account successfully registered!");

                    setTimeout(() => {
                        router.push("/APPLICANT/ApplicantHome");
                    }, 2000); // 2 seconds delay
                } else {
                    toast.error(
                        "An unexpected error occurred. Please try again later."
                    );
                }
            }
        } else {
            toast.error("Failed to update profile. Please try again.");
        }
    };

    useEffect(() => {
        if (!authTokens?.access) {
            console.error("No auth token found, cannot fetch profile.");
            return;
        }

        const fetchProfile = async () => {
            const data = await fetchApplicantProfile(authTokens);

            if (data) {
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));
            }
        };

        fetchProfile();
    }, [authTokens]);

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            First Name
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Last Name
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col lg:w-14 mb:flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            M.I.
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                required
                                onChange={handleChange}
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pb-5">
                    <div className="flex flex-col flex-shrink-0">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Email Address
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                disabled
                                required
                                readOnly={!isEditable}
                                className={`w-full px-2 py-1 outline-none rounded-xs 
                                ${
                                    isEditable
                                        ? "text-fontcolor"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-shrink">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
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
                                className={`w-full px-2 py-1 outline-none rounded-xs 
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
                            Sex
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <select
                                disabled={!isEditable}
                                className={`valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall ${
                                    !isEditable
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : " text-fontcolor"
                                }`}
                                id="sex"
                                name="sex"
                                value={formData.sex}
                                required
                                onChange={handleChange}
                            >
                                <option value="" disabled selected hidden>
                                    {" "}
                                    Select Sex
                                </option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Date of Birth
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="date"
                                id="birth-date"
                                name="date_of_birth"
                                required
                                value={formData.date_of_birth}
                                min={minDate.toISOString().split("T")[0]}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date_of_birth: e.target.value,
                                    })
                                }
                                onBlur={handleDateOfBirthChange}
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

                    <div className="flex flex-col flex-grow">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                            Age
                        </p>
                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                            <input
                                type="text"
                                id="age"
                                name="age"
                                placeholder="15+"
                                value={formData.age}
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

export default PersonalInfo;
