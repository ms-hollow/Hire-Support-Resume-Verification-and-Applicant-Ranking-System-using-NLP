import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

export default function CompanySettings(){
    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8  mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary "> Settings </h1>
                <div className="ml-4">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "66.66%" }}></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">Fill out all required job hiring details.</p>

                    <form>

                        {/*Settings Content */}

                        <div className="flex justify-between mt-1">          
                            <button type="button" className="button2 flex items-center justify-center">
                                <Link href="/COMPANY/CreateJob" className="ml-auto">
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
                            

                            <button type="button"  className="button1 flex items-center justify-center">
                                <Link href="/COMPANY/JobSummary" className="flex items-center space-x-2 ml-auto">
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
                                     <Image 
                                        src="/Arrow Right.svg" 
                                        width={23} 
                                        height={10} 
                                        alt="Continue Icon" 
                                    />
                                </Link>
                            </button>
                        </div>

                        
                    </form>
                   
                </div>
            </div>
            <GeneralFooter/>
        </div>
    );
}