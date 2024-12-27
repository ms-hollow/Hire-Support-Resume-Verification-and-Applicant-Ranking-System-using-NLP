import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import JobDetailsWrapper from "@/components/JobDetails";

export default function JobSummary(){
    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8  mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary "> Job Hiring Summary </h1>
                <div className="ml-4">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">Please take a moment to carefully review all of your Job Hiring Information to ensure everything is accurate and complete, then click 'Publish Job Hiring' to proceed.</p>

                    <form>
                    

                        {/*Job Summary Content */}

                        <div className="flex justify-between mt-1">          
                            <button type="button" className="button2 flex items-center justify-center">
                                <Link href="/COMPANY/CompanySettings" className="ml-auto">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                    </div>
                                </Link>
                            </button>
                            
                            <div className="flex gap-4">
                                <button type="button"  className="button2 flex items-center justify-center">
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center"> Save as Draft</p>
                                </button>

                                <button type="button"  className="button1 flex items-center justify-center">
                                    <Link href="/COMPANY/CompanyHome" className="flex items-center space-x-2 ml-auto">
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Publish Job Hiring</p>
                                    </Link>
                                </button>
                            </div>
                        </div>

                        
                    </form>
                   
                </div>
            </div>
            <GeneralFooter/>
        </div>
    );
}