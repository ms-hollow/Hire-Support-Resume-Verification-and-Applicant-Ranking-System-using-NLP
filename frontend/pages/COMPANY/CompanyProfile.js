import { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";

import GeneralFooter from "@/components/GeneralFooter";
import AuthContext from "../context/AuthContext";
import { useRouter } from 'next/router';
import CompanyHeader from "@/components/CompanyHeader";
import CompanyInfo from "@/components/CompanyInfo";

{/* Hindi pa nakacomponent yung Edit Button */}

export default function CompanyProfile() {
    let {authTokens} = useContext(AuthContext);
    const router = useRouter();
    const [isEditable, setIsEditable] = useState(false);

    const toggleEdit = () => {
      setIsEditable(!isEditable);
    };
  
   const handleUpdateComplete = () => {
      setIsEditable(false);
    };
  
    useEffect(()=> {
      if (!authTokens){
        router.push("/GENERAL/Login");
      }
    }, [])
  
  
    return (
      <div >
        <CompanyHeader />
        <div className="lg:pt-28 mb:pt-24 xsm:pt-24  sm:pt-24 mb:px-20 lg:px-20  sm:px-8 xsm:px-8 pb-8 mx-auto">
          <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-12">Account Profile</h1>
  
          <div className="flex items-center justify-center ">
          <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
            {/* Header Section */}
            <div className="flex flex-row justify-between items-center pt-3 mb-5">
              <p className="font-semibold lg:text-large mb:text-large sm:text-small  text-primary">Company Information</p>
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleEdit}
              >
                <Image
                  src="/Edit Icon.svg"
                  width={25}
                  height={11}
                  alt="Edit Icon"
                />
              </button>
            </div>
  
            <div className="flex flex-col items-center">
                <CompanyInfo isEditable={isEditable} onUpdateComplete={handleUpdateComplete}/>
            </div>
          </div>
          </div>
        </div>
        <GeneralFooter/>
      </div>
    );
  }
  