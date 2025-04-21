import Link from "next/link";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";

export default function  ApplicationSubmit () {
    return ( 
        <div>
            <ApplicantHeader/>
                <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
                    <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary mb-2">Application Submitted</h1>
                    <p id='full-name' className="font-thin lg:text-medium mb:text-meduim sm:text-xsmall xsm:text-xsmall text-fontcolor mb-8">Hi, NAME</p> 

                    <div className="flex items-center justify-center ">
                    <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
                        <p className="font-semibold lg:text-large mb:text-large sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-primary">Your application has been submitted!</p>

                        <div className="flex items-center pt-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`}>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 pb-8">
                            <div className="w-full overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                                <table className="w-full border-collapse">
                                <tbody>
                                    <tr className="px-2 border-b border-[#F5F5F5]">
                                    <td className="p-2 ">
                                        <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">Application Date</p>
                                        <p id="appDate" className=" pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">09-28-2024</p>
                                    </td>
                                    </tr>
                                    <tr className="px-2 border-b border-[#F5F5F5]">
                                    <td className="p-2 ">
                                        <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">Application ID</p>
                                        <p id="appID" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">00-0000</p>
                                    </td>
                                    </tr>
                                    <tr className="px-2 border-b border-[#F5F5F5]">
                                    <td className="p-2">
                                        <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">Application Status</p>
                                        <p id="status" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-primary">Pending</p>
                                    </td>
                                    </tr>
                                    <tr className="px-2">
                                    <td className="p-2">
                                        <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">HR Note</p>
                                        <p id="note" className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">Lorem ipsum dolor sit amet</p>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <Link href="/APPLICANT/MyJobs">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pt-4 pb-8 font-semibold underline">
                                    View your applications on My jobs
                                </p>
                            </Link>
                        </div>
              
                    </div>
                    </div>
                </div>
            <GeneralFooter/>
        </div>
     );
}