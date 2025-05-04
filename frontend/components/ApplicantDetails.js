import Image from "next/image";
import Link from "next/link";
import { useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ToastWrapper from "./ToastWrapper";
import { ApplicantDetailsSkeletonLoader } from "./ui/SkeletonLoader";
import AuthContext from "@/pages/context/AuthContext";
import {
    getApplicationDetails,
    editJobApplication,
    updateApplicationStatus,
} from "@/pages/api/companyJobApi";
import ConfirmationModal from "./ui/ConfirmationModal";

const ApplicantDetails = () => {
    const [individualApplicants, setindividualApplicants] = useState(null);
    const router = useRouter();
    const { id, applicant } = router.query;
    let { authTokens } = useContext(AuthContext);

    useEffect(() => {
        if (id && applicant && authTokens) {
            getApplicantionDetails();
        }
    }, [id, applicant, authTokens]);

    const getApplicantionDetails = async () => {
        if (!id) {
            console.error("Job ID is undefined");
            return;
        }

        try {
            const res = await getApplicationDetails(applicant, authTokens);
            setindividualApplicants(res);
        } catch (error) {
            console.error("Error fetching job applications:", error);
        }
    };

    if (!individualApplicants) {
        return <ApplicantDetailsSkeletonLoader />;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Top Part of applicant Details - Fixed */}
            <div className="job-details-box border-b-8 top rounded-t-lg p-4 ">
                <p className="font-medium text-fontcolor text-medium">
                    Applied For
                </p>
                <p className="font-semibold text-fontcolor text-large">
                    {individualApplicants?.job_title}
                </p>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-semibold text-primary text-large">
                        {individualApplicants?.applicant_profile?.first_name}{" "}
                        {individualApplicants?.applicant_profile?.middle_name}{" "}
                        {individualApplicants?.applicant_profile?.last_name}
                    </p>
                    <p className="font-thin text-fontcolor lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                        Applicant ID: {individualApplicants?.applicant}
                    </p>
                </div>

                <div className="flex justify-between gap-5 mt-2">
                    <button
                        type="button"
                        className="button1 flex flex-col items-center justify-center"
                    >
                        <Link href="" className="flex items-center space-x-2">
                            <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-medium text-center">
                                View Resume
                            </p>
                        </Link>
                    </button>
                    <button
                        type="button"
                        className="button2 flex flex-col items-center justify-center"
                    >
                        <Link href="" className="flex items-center space-x-2">
                            <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-medium text-center">
                                Supporting Documents
                            </p>
                        </Link>
                    </button>
                </div>
            </div>

            {/* Main Part of Applicant Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                <p className="font-semibold text-xsmall text-fontcolor">
                    Email Address
                </p>
                <p
                    id="EmployType"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {individualApplicants?.email}
                </p>

                <p className="font-semibold text-xsmall text-fontcolor">
                    Contact No.
                </p>
                <p
                    id="EmployType"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {individualApplicants?.applicant_profile?.contact_number}
                </p>

                {/* Complete Address*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    {" "}
                    Complete Address
                </p>
                <p
                    id="Qualifications"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {individualApplicants?.applicant_profile?.region}{" "}
                    {individualApplicants?.applicant_profile?.province}{" "}
                    {individualApplicants?.applicant_profile?.city}{" "}
                    {individualApplicants?.applicant_profile?.barangay}{" "}
                </p>

                {/*LinkedIn Profile*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    LinkedIn Profile
                </p>
                <p
                    id="AppliReq"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {individualApplicants?.applicant_profile?.linkedin_profile}
                </p>
            </div>
        </div>
    );
};

const ApplicantDetailsWrapper = () => {
    const [hiringDecision, setHiringDecision] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [individualApplicants, setindividualApplicants] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const router = useRouter();
    const { applicant } = router.query;
    let { authTokens } = useContext(AuthContext);
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        interview_date: "",
        interview_start_date: "",
        interview_end_date: "",
        interview_location_link: "",
    });

    const statusMapping = {
        Shortlist: "shortlisted",
        Reject: "rejected",
        "Schedule Interview": "interview scheduled",
        Email: "emailed",
        Accept: "accepted",
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setHiringDecision(value);

        if (value === "Schedule Interview") {
            setIsModalOpen(true);
        } else {
            setIsConfirmationModalOpen(true);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    //? Ito yung maghahandle ng edit
    const handleSchedule = async (e) => {
        e.preventDefault();
        const backendStatus = statusMapping[hiringDecision];

        if (hiringDecision === "Schedule Interview") {
            // Prepare payload for edit_job_application
            const payload = {
                application_status: backendStatus,
                interview_date: formData.interview_date,
                interview_start_time: formData.interview_start_date,
                interview_end_time: formData.interview_end_date,
                interview_location_link: formData.interview_location_link,
            };

            const res = await editJobApplication(
                applicant,
                payload,
                authTokens
            );

            if (res) {
                toast.success("Interview scheduled successfully!");
                handleCloseModal();
            }
        } else {
            const payload = {
                application_status: backendStatus,
            };

            const res = await updateApplicationStatus(
                applicant,
                payload,
                authTokens
            );

            if (res) {
                toast.success(res.message);
                setIsConfirmationModalOpen(false);
            }
        }
    };

    return (
        <div className="flex-1 h-[calc(100vh-150px)] border border-none rounded-lg">
            <ApplicantDetails />
            <ToastWrapper />
            <div className="flex flex-grow items-center lg:-mt-36 mb:-mt-16 ">
                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 mr-2 font-medium">
                    Hiring Decision:{" "}
                </p>
                <div className="flex h-medium rounded-xs border-2 border-fontcolor">
                    <select
                        className="valid:bg-primary invalid:bg-background valid:text-background invalid:text-fontcolor lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                        id="hiring-decision"
                        name="hiring-decision"
                        value={hiringDecision}
                        required
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>
                            {" "}
                            Hiring Decision
                        </option>
                        <option value="Shortlist">Shortlist</option>
                        <option value="Reject">Reject</option>
                        <option value="Schedule Interview">
                            Schedule Interview
                        </option>
                        <option value="Email">Email</option>
                        <option value="Accept">Accept</option>
                    </select>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-background rounded-xs shadow-lg p-6 w-[90%] max-w-md">
                            <p className="text-fontcolor mb-2">
                                Schedule an Interview for
                            </p>
                            <p className="font-semibold text-primary text-large mb-6">
                                {" "}
                                {individualApplicants?.name}{" "}
                            </p>

                            {/* Date Picker */}
                            <form>
                                <p className="text-fontcolor font-semibold mb-2">
                                    Interview Date
                                </p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex mb-6">
                                    <input
                                        type="date"
                                        name="interview_date"
                                        className="w-full px-2"
                                        value={formData.interview_date}
                                        min={today}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Time Picker */}
                                <p className="text-fontcolor font-semibold mb-4">
                                    Interview Time
                                </p>
                                <div className="flex flex-row gap-4 mb-6">
                                    <div className="flex items-center flex-row flex-grow">
                                        <p className="text-fontcolor font-semibold mr-2">
                                            Start:
                                        </p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input
                                                type="time"
                                                className="w-full px-2"
                                                name="interview_start_date"
                                                value={
                                                    formData.interview_start_date
                                                }
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-row flex-grow">
                                        <p className="text-fontcolor font-semibold mr-2">
                                            End:
                                        </p>
                                        <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                            <input
                                                type="time"
                                                className="w-full px-2"
                                                name="interview_end_date"
                                                value={
                                                    formData.interview_end_date
                                                }
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location/Link */}
                                <div className="flex flex-col flex-grow mb-6">
                                    <p className="text-fontcolor font-semibold mb-2">
                                        Interview Location/Link
                                    </p>
                                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                        <input
                                            type="text"
                                            name="interview_location_link"
                                            required
                                            value={
                                                formData.interview_location_link
                                            }
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center space-x-6">
                                    <button
                                        className="button1 flex items-center justify-center"
                                        onClick={handleSchedule}
                                    >
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                            Schedule
                                        </p>
                                    </button>
                                    <button
                                        type="button"
                                        className="button2 flex items-center justify-center"
                                        onClick={handleCloseModal}
                                    >
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                            {" "}
                                            Cancel{" "}
                                        </p>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {isConfirmationModalOpen && (
                    <ConfirmationModal
                        isOpen={isConfirmationModalOpen}
                        onConfirm={handleSchedule}
                        onCancel={() => setIsConfirmationModalOpen(false)}
                        message={`Are you sure you want to ${hiringDecision.toLowerCase()} this applicant?`}
                    ></ConfirmationModal>
                )}
            </div>
        </div>
    );
};

export default ApplicantDetailsWrapper;
