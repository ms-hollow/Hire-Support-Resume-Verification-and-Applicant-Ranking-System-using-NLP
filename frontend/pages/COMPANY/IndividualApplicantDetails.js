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
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5"> Applicant Details</h1>

        <div className="flex flex-row gap-5">
          <div className="w-5/12 flex flex-col">
            <ApplicantDetailsWrapper/>
          </div>

          <div className="w-full flex flex-col">
            <IndividualScore/>
          </div>
        </div>
      </div>
      <GeneralFooter />
    </div>
  );
}
