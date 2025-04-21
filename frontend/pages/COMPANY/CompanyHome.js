import { useEffect, useRef, useState, useContext } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
import { getCompany } from "../api/companyApi";
import { fetchJobList, deleteJobHiring } from "../api/companyJobApi";

//* PAGE STATUS
// TODO - Pass the job hiring id to query (for edit job hiring & view)

const getStatusClassName = (status) => {
    const statusClasses = {
        complete: "text-complete",
        open: "text-fontcolor",
        draft: "text-primary",
        closed: "text-accent"
    };
    return statusClasses[status] || "text-default";
};

export default function CompanyHome() {
    const [jobLists, setJobLists] = useState([]);
    const [companyName, setCompanyName] = useState(null);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);


    let { authTokens } = useContext(AuthContext);

    const fetchJobLists = async () => {
        if (!authTokens) {
            router.push("/GENERAL/Login");
            return;
        }

        const companyData = await getCompany(authTokens);
        setCompanyName(companyData?.profile_data?.company_name || " ");

        const jobData = await fetchJobList(authTokens);
        if (jobData) {
            setJobLists(jobData);
        }
    };

    const headerRef = useRef(null);
    const bodyRef = useRef(null);
    const isSyncing = useRef(false); // Prevent infinite loop

    const syncScroll = (event, source) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    if (source === "header" && bodyRef.current) {
      bodyRef.current.scrollLeft = event.target.scrollLeft;
    } else if (source === "body" && headerRef.current) {
      headerRef.current.scrollLeft = event.target.scrollLeft;
    }

    isSyncing.current = false;
  };

    useEffect(() => {
        fetchJobLists();
    }, [authTokens, router]);

    const handleJobView = (id) => {
        // console.log("selectedJobId", jobId);
        router.push({
            pathname: "/COMPANY/ApplicantsSummary",
            query: { id },
        });
    };

    const handleEditJob = (id) => {
        // console.log("selectedJobId", jobId);
        router.push({
            pathname: "/COMPANY/EditJobHiring",
            query: { id },
        });
    };

    const handleDelete = async (jobId) => {
        const success = await deleteJobHiring(jobId, authTokens);
        if (success) {
            alert("Job successfully deleted");
            setJobLists((prevJobLists) =>
                prevJobLists.filter((job) => job.id !== jobId)
            );
            await fetchJobLists();
        } else {
            alert("Failed to delete job.");
        }
    };

    const handleOpenModal = (jobId) => {
        const job = jobLists.find((j) => j.job_hiring_id === jobId);
        setSelectedJob(job);
        setIsModalOpen(true);
      };
      
      const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
      };

    return (
        <div>
                <CompanyHeader />
                <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-8 mx-auto pb-8">
                    <div>
                        <p className="text-fontcolor text-large pb-8">Hi, {companyName}</p>
                    </div>

                    <div className="overflow-x-auto w-full">
                      {/* Wrapper to ensure alignment */}
                      <div className="relative w-full">
                        {/* Header Table */}
                        <div ref={headerRef} className="overflow-x-auto w-full scrollbar-hide" onScroll={(e) => syncScroll(e, "header")} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <table className="table-fixed min-w-[800px] w-full border-b-2 border-[#D9D9D9]">
                            <thead className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-primary bg-white">
                              <tr>
                                <th className="w-[200px] text-center p-5">Job Title</th>
                                <th className="w-[150px] text-center">Status</th>
                                <th className="w-[200px] text-center">No. of Applications</th>
                                <th className="w-[200px] text-center">Deadline</th>
                                <th className="w-[250px] text-center">Job Hiring Details</th>
                              </tr>
                            </thead>
                          </table>
                        </div>

                        <div ref={bodyRef} className="overflow-x-auto w-full" onScroll={(e) => syncScroll(e, "body")}>
                          <table className="table-fixed min-w-[800px] w-full border-collapse text-center">
                            <tbody>
                                {jobLists.length > 0 ? (
                                    jobLists.map((job, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-[#F1F1F1] hover:border-primary border-b-2 border-[#D9D9D9]"
                                        >
                                            <td className="w-[200px] p-5 font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                                                {job.job_title}
                                            </td>
                                            <td
                                                className={`w-[150px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall ${getStatusClassName(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    job.status.slice(1)}
                                            </td>
                                            <td className="w-[200px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                                                {job.num_applications}
                                            </td>
                                            <td className="w-[200px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                                                {job.application_deadline}
                                            </td>
                                            <td className="w-[250px]">
                                              <div className="flex justify-center gap-5 px-5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleJobView(
                                                                job.job_hiring_id
                                                            )
                                                        }
                                                    >
                                                        <Link href="/COMPANY/ApplicantsSummary">
                                                          <Image src="/Eye Icon.svg" width={30} height={15} alt="Eye Icon" />
                                                        </Link>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditJob(
                                                                job.job_hiring_id
                                                            )
                                                        }
                                                    >
                                                        <Link href="/COMPANY/EditJobHiring">
                                                          <Image src="/Edit Icon.svg" width={30} height={15} alt="Edit Icon" />
                                                        </Link>
                                                    </button>
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => handleOpenModal(job.job_hiring_id)}
                                                        >
                                                        <Image
                                                            src="/Delete.png"
                                                            width={25}
                                                            height={15}
                                                            alt="Delete Icon"
                                                        />
                                                    </div>
                                                    {isModalOpen && selectedJob && (
                                                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/0 lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 lg:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto z-50">
                                                            <div className="bg-background rounded-xs shadow-lg p-6 w-2/6">
                                                            <div className="flex justify-center items-center mb-4">
                                                                <Image src="/Delete.png" width={70} height={50} alt="Delete Icon" />
                                                            </div>

                                                            <p className="text-center text-gray-700 mb-6">
                                                                Are you sure you want to delete <span className="text-accent font-bold">{selectedJob.job_title}</span> job hiring? Deleting this job hiring
                                                                will <span className="text-fontcolor font-bold">permanently delete </span>all applications for this job.
                                                            </p>

                                                            <div className="flex justify-center space-x-6">
                                                                <button
                                                                className="button1 flex items-center justify-center"
                                                                onClick={() => {
                                                                    handleDelete(selectedJob.job_hiring_id);
                                                                    handleCloseModal();
                                                                }}
                                                                >
                                                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Yes</p>
                                                                </button>

                                                                <button className="button2 flex items-center justify-center" onClick={handleCloseModal}>
                                                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">No</p>
                                                                </button>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        )}
                                              </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5"
                                            className="p-5 text-center"
                                        >
                                            No job details available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              <GeneralFooter/>
        </div>
    );
}
