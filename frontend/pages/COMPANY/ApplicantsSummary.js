import CompanyHeader from "@/components/CompanyHeader";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";
import GeneralFooter from "@/components/GeneralFooter";
import Ranking from "@/components/Ranking";
import { useState, useEffect} from "react";

export default function ApplicantsSummary(){

    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto pb-8">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">Applicants Summary</h1>

                <div className="flex flex-row gap-5 ">
                  <CompanyJobDetailsWrapper />
                    <div className="w-5/6 flex flex-col">
                        <Ranking/>
                    </div>
                </div>

            </div>
            <GeneralFooter/>
        </div>
    );
}