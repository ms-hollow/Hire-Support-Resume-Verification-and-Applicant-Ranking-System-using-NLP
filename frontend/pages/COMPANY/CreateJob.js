import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

export default function CreateJob(){
    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8  mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-12">Create Job Hiring </h1>
                <div className="flex items-center justify-center">
                    <div className="box-container px-8 py-5 mx-auto">
                        <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">Job Hiring Information</p>

                        <div className="flex items-center pt-2 pb-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "33.33%" }}></div>
                            </div>
                        </div>

                        <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">Fill out all required job hiring details.</p>

                        <form>

                            {/* Create Job Content */}

                            <div className="flex justify-end"> 
                                <button type="button" className="button1 flex items-center justify-center">
                                    <Link href="/COMPANY/CompanySettings" className="ml-auto">
                                        <div className="flex items-center space-x-2">
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
                                            <Image 
                                                src="/Arrow Right.svg" 
                                                width={23} 
                                                height={10} 
                                                alt="Continue Icon" 
                                            />
                                        </div>
                                    </Link>

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <GeneralFooter/>
        </div>
    );
}