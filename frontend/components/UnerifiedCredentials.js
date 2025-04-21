import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const UnerifiedCredentials = () => {
    return (
      <div className="flex flex-col pt-5 w-full">
        <div className="flex flex-col items-center justify-center w-full pb-2 ">
          <div className="flex flex-col items-center md:items-start w-full max-w-4xl px-4 py-3 bg-white shadow-lg hover:bg-[#F1F1F1] rounded-lg">
            <p className=" text-fontcolor text-base md:text-large text-center md:text-left">
              Transcript of Record
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full pb-2">
          <div className="flex flex-col items-center md:items-start w-full max-w-4xl px-4 py-3 bg-white shadow-lg hover:bg-[#F1F1F1] rounded-lg">
            <p className="text-fontcolor text-base md:text-large text-center md:text-left">
              Diploma
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  const UnverifiedCredentialsWrapper = () => {
    return (
      <div className="flex flex-col overflow-y-auto p-2 max-h-full bg-background">
        <UnerifiedCredentials />
      </div>
    );
  };
  
  export default UnverifiedCredentialsWrapper;
  
  