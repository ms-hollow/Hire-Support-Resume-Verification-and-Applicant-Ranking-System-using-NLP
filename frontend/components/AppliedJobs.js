import Link from "next/link";
import Image from 'next/image';

const AppliedJobs = () => {
    

    return (
        <div>
        {/* Applied Job #1 */}
        <div className="flex flex-col pt-4">
                <div className="box-container px-2 py-2 mb-4">
                    <div className="grid grid-cols-12  gap-4 p-3">
                        <div className="col-span-2  justify-center">
                            <Image src="/Logo.png" width={50} height={30} alt="Company Logo" />
                        </div>
                        <div className="col-span-10 flex flex-col w-full"> 
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <b className="font-bold lg:text-large mb:text-medium sm:text-medium xsm:text-xsmall xxsm:text-xsmall text-fontcolor">Job Title</b>
                                    <div className="lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall font-thin text-fontcolor">
                                        <p>Company Name</p>
                                    </div>
                                </div>

                                <div className="flex items-start ml-5 gap-4"> 
                                    <div className="flex items-center gap-4">
                                        <button className="button1 items-center flex justify-center text-center">
                                            <Link href="/APPLICANT/ViewApplication" className="ml-auto">
                                                <p className="lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall  text-center">View Application</p>
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col mt-2" >
                                <div className="flex items-center">
                                    <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                    <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">Location</p>
                                </div>

                                <div className="flex items-center mt-2">
                                    <Image src="/Status.svg" width={18} height={20} alt="Status Icon" className="-ml-.75" />
                                    <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-primary">Pending</p>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <div className="flex items-center mt-2">
                                        <Image src="/APPLICATION ID ICON.png" width={23} height={20} alt="Status Icon" className="-ml-.75" />
                                        <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">Applicant ID</p>
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <Image src="/CALENDAR ICON.png" width={23} height={20} alt="Status Icon" className="-ml-.75" />
                                        <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">Applicantion Date</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div> 
    );
}

const AppliedJobsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <AppliedJobs/>
        </div>
    );
};

export default AppliedJobsWrapper;