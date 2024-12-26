import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";

export default function ApplicantsSummary(){
    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8  mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-12">Applicants Summary</h1>

                

            </div>
            <GeneralFooter/>
        </div>
    );
}