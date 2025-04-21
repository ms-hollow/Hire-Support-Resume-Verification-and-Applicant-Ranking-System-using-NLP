import { useState } from "react";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import ReviewApplication from "@/components/ReviewApplication";
import JobDetailsWrapper from "@/components/JobDetails";

export default function ViewApplication({handleJobClick}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [showJobDetails, setShowJobDetails] = useState(false);

  const handleToggleDetails = () => {
      setShowJobDetails((prev) => !prev); // Toggle visibility
  };

  return (
    <div>
      <ApplicantHeader />
          <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 lg:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto">
            <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1"> You are Applying for</p>
            <p className="font-semibold text-primary text-large pb-1">Job Title</p>
            <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">Company</p>
            <div className="relative">
                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-8 font-bold underline cursor-pointer" onClick={handleToggleDetails} >See job hiring details</p>
                {showJobDetails && (
                    <div className="flex items-center justify-center absolute inset-0 bg-background h-screen ">
                        <div className="relative w-full lg:w-6/12 mb:w-10/12 sm:w-full z-10 bg-background rounded ">
                            <button onClick={() => setShowJobDetails(false)} className="absolute -top-12 right-0  text-xl text-fontcolor hover:text-gray-700" > ✖ </button>
                            <JobDetailsWrapper
                            /*authToken={authTokens?.access}*/
                            onJobClick={handleJobClick}
                            />
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pb-8">
            <div className="box-container px-8 py-5 mx-auto">
              <ReviewApplication showEditButtons={false}/>

              <div className="flex items-center justify-center pt-4">
                <button type="button" className="button1 flex items-center justify-center "onClick={handleOpenModal}>
                  <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Withdraw Application</p>
                </button>
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 lg:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto">
                  <div className="bg-background rounded-xs shadow-lg p-6 w-50%">
                    <p className="text-center text-gray-700 mb-6">
                      Are you sure you want to <span className="text-accent font-bold ">withdraw your application?</span> Withdrawing
                      will <span className="text-accent font-bold">permanently delete </span>your submitted application for this job.
                    </p>
                    <div className="flex justify-center space-x-6">
                  
                      <button className="button1 flex items-center justify-center" onClick={() => {alert("Application withdrawn successfully!"); handleCloseModal();}}>
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
          </div>

      <GeneralFooter />
    </div>
  );
}
