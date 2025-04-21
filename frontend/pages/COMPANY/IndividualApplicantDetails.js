import { useState } from "react";
import ApplicantDetailsWrapper from "@/components/ApplicantDetails";
import CompanyHeader from "@/components/CompanyHeader";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";
import GeneralFooter from "@/components/GeneralFooter";
import IndividualScore from "@/components/IndividualScore";
import Ranking from "@/components/Ranking";

export default function IndividualApplicantDetails() {
  

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 sm:pt-24 xsm:pt-24 xxsm:pt-24 lg:px-20 mb:px-10 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto pb-8">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5"> Applicant Details</h1>

        <div className="flex lg:flex-row mb:flex-row gap-5">
          <div className="lg:w-[45%] md:w-3/6 sm:w-full hidden md:block">
            <ApplicantDetailsWrapper/>
          </div>

          <div className="lg:w-[100%] md:w-5/6 sm:w-full flex flex-col">
            <IndividualScore/>
          </div>
        </div>
      </div>
      <GeneralFooter />
    </div>
  );
}
