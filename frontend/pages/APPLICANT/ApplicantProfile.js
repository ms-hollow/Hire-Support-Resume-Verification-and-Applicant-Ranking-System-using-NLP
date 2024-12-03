import { useState } from "react";
import Image from "next/image";
import ApplicantHeader from "@/components/ApplicantHeader";
import PersonalInfo from "@/components/PersonalInfo";
import GeneralFooter from "@/components/GeneralFooter";

export default function ApplicantProfile() {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div >
      <ApplicantHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-8 xsm:px-8 lg:px-20 pb-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-12">Account Profile</h1>

        <div className="box-container p-8 py-5 mx-auto">
          {/* Header Section */}
          <div className="flex flex-row justify-between items-center pt-3 mb-5">
            <p className="font-semibold lg:text-large mb:text-large sm:text-xsmall text-primary">Personal Information</p>
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

          {/* Personal Info Content */}
           {/* Hindi pa naka read0nly yung fields */}

          <div className="flex flex-col items-center">
            <PersonalInfo showRegisterButton={false} isEditable={isEditable} />
            {isEditable && (
              <button onClick={() => alert("Updated successfully!")} className="button1 flex items-center justify-center">
                 <p className="lg:text-medium font-medium">Update</p>
              </button>
            )}
          </div>
        </div>
      </div>
      <GeneralFooter/>
    </div>
  );
}
