import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ToastWrapper from "./ToastWrapper";
import { toTitleCase } from "@/pages/utils/functions";

const ReviewApplication = ({ showEditButtons = true, applicationDetails }) => {
    return (
        <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
            {/* Job Information Section */}
            <section className="pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">
                        Job Information
                    </p>
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Job Title:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {applicationDetails?.job_title}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Company:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {applicationDetails?.company_name}
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Personal Information Section */}

            <ToastWrapper />
            <section className=" pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">
                        Personal Information
                    </p>
                    {showEditButtons && (
                        <button className="flex items-center focus:outline-none">
                            <Link href="/APPLICANT/JobApplication">
                                <Image
                                    src="/Edit Icon.svg"
                                    width={25}
                                    height={11}
                                    alt="Edit Icon"
                                />
                            </Link>
                        </button>
                    )}
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Full Name:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.applicant
                                                    ?.first_name
                                            }{" "}
                                            {
                                                applicationDetails?.applicant
                                                    ?.middle_name
                                            }{" "}
                                            {
                                                applicationDetails?.applicant
                                                    ?.last_name
                                            }{" "}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Email Address:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {applicationDetails?.email}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Contact No.:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.applicant
                                                    ?.contact_number
                                            }
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Complete Address:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.applicant
                                                    ?.region
                                            }
                                            ,{" "}
                                            {toTitleCase(
                                                applicationDetails?.applicant
                                                    ?.province
                                            )}
                                            ,{" "}
                                            {toTitleCase(
                                                applicationDetails?.applicant
                                                    ?.city
                                            )}
                                            ,{" "}
                                            {toTitleCase(
                                                applicationDetails?.applicant
                                                    ?.barangay
                                            )}
                                            ,{" "}
                                            {
                                                applicationDetails?.applicant
                                                    ?.present_address
                                            }
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        LinkedIn Profile Link:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.applicant
                                                    ?.linkedin_profile
                                            }
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Interview Section */}
            <section className="pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">
                        Interview Details
                    </p>
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Interview Date:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {applicationDetails?.interview_date}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Interview Time:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.interview_start_time
                                            }{" "}
                                            -{" "}
                                            {
                                                applicationDetails?.interview_end_time
                                            }
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Interview Location/Link:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {
                                                applicationDetails?.interview_location_link
                                            }
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ReviewApplication;
