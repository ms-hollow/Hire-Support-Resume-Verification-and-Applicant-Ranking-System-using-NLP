import { useState, useContext, useEffect } from 'react';
import ApplicantHeader from "@/components/ApplicantHeader";
import SavedJobs from "@/components/SavedJobs";
import AppliedJobs from "@/components/AppliedJobs";
import GeneralFooter from '@/components/GeneralFooter';
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function MyJobs() {
  const [activeTab, setActiveTab] = useState('saved');

  let {authTokens} = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (!authTokens) {
          router.push('/GENERAL/Login');
      }
    }, [authTokens, router]);

  return (
    <div>
      <ApplicantHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 py-8 mx-auto">
      <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-2">My Jobs</h1>

      
      <div className=" flex w-full flex-row justify-center gap-56 relative">
          <p className={`text-fontcolor font-normal text-medium  cursor-pointer ${ activeTab === 'saved' ? 'text-primary' : ''}`} onClick={() => setActiveTab('saved')}> Saved Jobs</p>
          <p className={`text-fontcolor font-normal text-medium cursor-pointer ${activeTab === 'applied' ? 'text-primary' : ''}`} onClick={() => setActiveTab('applied')} > Applied Jobs</p>

          {/* Static Underline */}
          <div className="absolute top-8 left-0 w-full h-[1px] bg-primary " />
          {/* Dynamic Underline */}
          <div className="absolute top-8 h-[3px] bg-primary transition-all duration-300 ease-in-out" style={{ width: '50%', left: activeTab === 'saved' ? '0%' : '50%', }} /> </div>

          {/* Content Below the Underline */}
   
          <div className="flex-1 overflow-y-auto mt-5 flex justify-center items-center w-full">
            {activeTab === 'saved' ? ( <SavedJobs/>
            ) : (
              <AppliedJobs/>
            )}
          </div>
        </div>
      <GeneralFooter />
    </div>
  );
}