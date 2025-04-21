import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Ranking from "@/components/Ranking";
import { fetchJobList } from "../api/companyJobApi";
import AuthContext from "../context/AuthContext";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";

export default function ApplicantsSummary() {
    const router = useRouter();
    const { id } = router.query;
    const { authTokens } = useContext(AuthContext);
    const [job, setJobTitle] = useState(null);

    useEffect(() => {
        const fetchJobData = async () => {
        if (!authTokens || !id) return;

        const jobData = await fetchJobList(authTokens);
        const foundJob = jobData?.find((job) => job.job_hiring_id === parseInt(id));
        if (foundJob) {
            setJobTitle(foundJob);
        }
        };

        fetchJobData();
    }, [authTokens, id]);


  return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 sm:pt-24 xsm:pt-24 xxsm:pt-24 lg:px-20 mb:px-10 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto pb-8">
            <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
                Applicants Summary for <span className="text-fontcolor">{job?.job_title} ({job?.experience_level}) </span> 
            </h1>
            <div className="flex lg:flex-row mb:flex-row gap-5">
            <div className="lg:w-2/6 md:w-3/6 sm:w-full hidden md:block">
                <CompanyJobDetailsWrapper/>
            </div>
            <div className="lg:w-5/6 md:w-5/6 sm:w-full flex flex-col">
                <Ranking />
            </div>
            </div>
        </div>
      <GeneralFooter />
    </div>
  );
}
