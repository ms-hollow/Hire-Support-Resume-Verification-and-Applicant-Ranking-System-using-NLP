import { useEffect, useContext } from "react";
import Image from "next/image";
import CompanyHeader from "@/components/CompanyHeader";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";
import GeneralFooter from "@/components/GeneralFooter";
import { useRouter } from "next/router";
import { deleteJobHiring } from "../api/companyJobApi";
import AuthContext from "../context/AuthContext";

export default function EditJobHiring() {
    let { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!authTokens) {
            router.push("/GENERAL/Login");
            return;
        }
    }, []);

    const handleViewApplicantSummary = () => {
        console.log("selectedJobId", id);
        router.push({
            pathname: "/COMPANY/ApplicantSummary",
            query: { id },
        });
    };

    const handleDelete = async () => {
        const success = await deleteJobHiring(id, authTokens);
        if (success) {
            alert("Job successfully deleted");
            router.push("/COMPANY/CompanyHome");
        } else {
            alert("Failed to delete job.");
        }
    };

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto pb-8">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
                    Job Hiring Details{" "}
                </h1>

                <div className="flex flex-row justify-end px-5">
                    <button
                        type="button"
                        className="button1 flex flex-col items-center justify-center mr-10"
                        onClick={handleViewApplicantSummary}
                    >
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                            {" "}
                            View Applicants Summary{" "}
                        </p>
                    </button>
                    <div onClick={handleDelete} className="cursor-pointer">
                        <Image
                            src="/Delete.png"
                            width={30}
                            height={15}
                            alt="Delete Icon"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-5">
                    <CompanyJobDetailsWrapper />
                    <div className="w-4/6 flex flex-col">
                        <p>Add settings here</p>
                    </div>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
