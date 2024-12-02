import { useState } from "react";
import Image from 'next/image';
import GeneralHeader from '@/components/GeneralHeader';
import GeneralFooter from '@/components/GeneralFooter';

const SavedJobs = () => {
    const [isSaved, setIsSaved] = useState(false);
    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    return (
        <div className="flex flex-col">
            <><GeneralHeader />
                {/* Saved Job #1 */}
                <div className="flex flex-col items-center justify-center w-screen pt-6">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now </a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
                {/* Saved Job #2 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now</a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
                {/* Saved Job #3 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now</a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
                {/* Saved Job #4 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now</a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
                {/* Saved Job #5 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now</a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
                {/* Saved Job #6 */}
                <div className="flex flex-col items-center justify-center w-screen pt-4">
                    <div className="box-container px-8 py-5 ">
                        <div className="flex flex-row items-center -mt-8">
                            <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                            <div className="ml-4 mt-8">
                                <b className="font-bold text-large text-fontcolor">Job Title</b>
                                    <div className="text-xsmall font-thin text-fontcolor mt-1">
                                        <p>Company</p>
                                        <p>Job Industry</p>
                                    </div>
                            </div>
                            <div className="text-center ml-40">
                                <a href="/APPLICANT/JobApplication" className="button1 lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium">Apply Now</a>
                            </div>
                            <button onClick={toggleSave} className="ml-auto">
                                <Image src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={isSaved ? "Save Icon" : "Unsave Icon"} />
                            </button>
                        </div>  
                        <div className="flex flex-row justify-between mt-2 px-11">
                            <div className="flex flex-row">
                                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                            </div>
                            <div className="flex flex-row mx-4">
                                <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                            </div>
                            <div className="flex flex-row">
                                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 px-11">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                        </div>
                    </div>
                </div>
            <GeneralFooter /></>
        </div>
    );
}

const SavedJobsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <SavedJobs/>
        </div>
    );
};

export default SavedJobsWrapper;