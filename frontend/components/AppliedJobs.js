import { useState } from "react";
import Image from 'next/image';
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';

const AppliedJobs = () => {

    return (
        <div className="flex flex-col">
            <><GeneralHeader />
                {/* Saved Job #1 */}
                <div className="flex flex-col items-center justify-center w-screen pt-6">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Saved Job #2 */}
                 <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Saved Job #3 */}
                 <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Saved Job #4 */}
                 <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Saved Job #5 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Saved Job #6 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-4">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-4">
                                <b className="font-bold text-large text-fontcolor -mt-5">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor -mt-.5">
                                        <p>Company</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">View Application</a>
                            </div>
                        </div>  
                        <div className="flex flex-row mt-2 ml-10 text-fontcolor">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                        </div>

                        <div className="flex flex-row mt-2 ml-10 pl-px text-fontcolor">
                            <Image 
                                src="/pending icon.png" 
                                width={23} 
                                height={20}
                                alt="Pending Icon"
                            />
                            <p id='pending' className="ml-1.5 mt-0.5 font-thin text-xsmall pl-px text-primary">Pending</p>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/APPLICATION ID ICON.png" 
                                width={20} 
                                height={20}
                                alt="Application Id Icon"
                            />
                            <p id='application id' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Application ID</p>
                            <div className="flex flex-row ml-20">
                                <Image src="/CALENDAR ICON.png" width={18} height={20} alt="application id icon" />
                                <p id='application date' className="ml-2 font-thin text-xsmall text-fontcolor">Application Date</p>
                            </div>
                        </div>
                    </div>
                </div>
            <GeneralFooter /></>
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