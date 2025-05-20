import { useState, useEffect, useContext } from "react";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import ViewApplicationComponent from "@/components/ViewApplicationComponent";
import { toast } from "react-toastify";
import ToastWrapper from "@/components/ToastWrapper";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import {
  getSpecificJobApplication,
  withdrawJobApplication,
} from "@/pages/api/applicantJobApi";

export default function ViewApplication() {
  const { authTokens } = useContext(AuthContext);
  const router = useRouter();
  const { applicationId } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getApplicationDetails = async () => {
    setLoading(true); // Start loading
    try {
      const res = await getSpecificJobApplication(
        authTokens?.access,
        applicationId
      );
      setApplicationDetails(res);
    } catch (error) {
      toast.error("Failed to fetch application details.");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (applicationId && authTokens) {
      getApplicationDetails();
    }
  }, [applicationId, authTokens]);

  const handleWithdrawApplication = async () => {
    try {
      const res = await withdrawJobApplication(
        authTokens?.access,
        applicationId
      );

      if (res.message === "Job application is already withdrawn.") {
        toast.info(res.message);
        setIsModalOpen(false);
      } else {
        toast.success(res.message);
        router.push("/APPLICANT/ApplicantHome");
      }
    } catch (error) {
      console.log(error.message || "Failed to cancel application.");
    }
  };

  return (
    <div>
      <ApplicantHeader />
      <ToastWrapper />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-4 py-8 mx-auto">
        {loading ? ( // Show loading indicator
          <p className="text-center text-gray-500 flex items-center justify-center h-screen">
            Loading...
          </p>
        ) : (
          <>
            <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">
              You are Applying for
            </p>
            <p className="font-semibold text-primary text-large pb-1">
              {applicationDetails?.job_title}
            </p>
            <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">
              {applicationDetails?.company_name}
            </p>
          </>
        )}
      </div>

      {!loading && applicationDetails && (
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="px-8 py-5 mx-auto">
            <ViewApplicationComponent
              showEditButtons={false}
              applicationDetails={applicationDetails}
            />

            <div className="flex items-center justify-center pt-4">
              <button
                type="button"
                className="button1 flex items-center justify-center"
                onClick={handleOpenModal}
              >
                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                  Withdraw Application
                </p>
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/0 lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 lg:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto">
                <div className="bg-background rounded-xs shadow-lg p-6 w-50%">
                  <p className="text-center text-gray-700 mb-6">
                    Are you sure you want to{" "}
                    <span className="text-accent font-bold">
                      withdraw your application?
                    </span>{" "}
                    This will{" "}
                    <span className="text-accent font-bold">
                      mark it as withdrawn
                    </span>{" "}
                    and it will no longer be considered.
                  </p>
                  <div className="flex justify-center space-x-6">
                    <button
                      className="button1 flex items-center justify-center"
                      onClick={handleWithdrawApplication}
                    >
                      <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                        Yes
                      </p>
                    </button>

                    <button
                      className="button2 flex items-center justify-center"
                      onClick={handleCloseModal}
                    >
                      <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                        No
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <GeneralFooter />
    </div>
  );
}
