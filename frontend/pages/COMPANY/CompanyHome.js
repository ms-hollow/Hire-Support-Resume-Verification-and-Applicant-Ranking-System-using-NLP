import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";

export default function CompanyHome(){
    return(
        <div>
            <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8  mx-auto">
                <div>
                    <p className="text-fontcolor">Hi, Name</p>
                </div>

                

            </div>
            <GeneralFooter/>
        </div>
    );
}