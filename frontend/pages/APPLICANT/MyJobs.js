import { useState } from 'react';
import ApplicantHeader from "@/components/ApplicantHeader";
import SavedJobs from "@/components/SavedJobs";
import AppliedJobs from "@/components/AppliedJobs";
import GeneralFooter from '@/components/GeneralFooter';

export default function MyJobs() {
  const [activeTab, setActiveTab] = useState('saved');

  return (
    <div>
      <><ApplicantHeader />

      <div className="text-primary lg:pt-36 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-10 sm:px-10 xsm:px-10 lg:px-10 mx-auto"><b>My Jobs</b></div>

      <div className="relative flex justify-between items-center lg:pt-18 mb:pt-12 xsm:pt-12 sm:pt-12 lg:px-80 mb:px-80 sm:px-80 xsm:px-80 sm:l-50% mx-auto">
            {/* yung naghohover na underline */}
            <div 
            className="absolute bottom-[-5px] w-[44%] h-[5px] bg-[#5352e9] transition-all duration-300 ease-in-out" 
            id="hover-line-MyJobs" 
            style={{ left: activeTab === 'saved' ? '5%' : activeTab === 'applied' ? '51%' : '0%' }}
            />

            {/* Saved */}
            <p 
            className="text-fontcolor font-normal cursor-pointer relative top-[-10px] hover:text-primary sm:-px-20"
            onClick={() => setActiveTab('saved')}
            >Saved</p>

            {/* Applied */}
            <p 
            className="text-fontcolor hover:text-primary font-normal cursor-pointer relative top-[-10px]"
            onClick={() => setActiveTab('applied')}
            >Applied</p>
      </div>
    {/* yung static na underline */}
      <div className="mt-0.25 h-[1px] bg-[#5352E9] w-[90%] mx-auto"></div>

      <div className='flex flex-row pt-4 '>
            <div id="saved-jobs" style={{ display: activeTab === 'saved' ? 'block' : 'none' }}>
            <SavedJobs />
            </div>
            <div id="applied-jobs" style={{ display: activeTab === 'applied' ? 'block' : 'none' }}>
            <AppliedJobs />
            </div>
      </div>
      <GeneralFooter /></>
    </div>
  );
}