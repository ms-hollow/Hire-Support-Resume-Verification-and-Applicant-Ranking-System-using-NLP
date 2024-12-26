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
      <div className="py-20">
        <div className="fixed text-primary md:px-20 sm:px-8 xsm:px-8">
            <b className="text-lg">My Jobs</b>
        </div>

        <div className="flex justify-between w-[50%] relative z-10 pt-8 py-3 lg:mx-80 lg:w-[50%] md:w-[53%] md:mx-40 sm:w-[60%] sm:mx-20 xsm:w-[65%] xsm:mx-12">
            {/* Saved */}
            <p 
                className={`text-fontcolor font-normal cursor-pointer px-10 ${activeTab === 'saved' ? 'text-primary' : ''}`}
                onClick={() => setActiveTab('saved')}
                >Saved</p>

            {/* Applied */}
            <p 
                className={`text-fontcolor font-normal cursor-pointer ${activeTab === 'applied' ? 'text-primary' : ''}`}
                onClick={() => setActiveTab('applied')}
                >Applied</p>
        </div>
        {/* static underline */}
        <div className="relative lg:w-[88%] lg:mx-20 md:w-[80%] md:mx-20 sm:w-[87%] sm:mx-8 xsm:w-[84%] xsm:mx-8">
            <div className="mt-0.25 h-[1px] bg-primary"></div>
        </div>
        {/* dynamic underline */}
        <div className="relative lg:w-[88%] lg:mx-20 md:w-[80%] md:mx-20 sm:w-[87%] sm:mx-8 xsm:w-[84%] xsm:mx-8">
            <div 
            className="absolute bottom-0 h-[5px] bg-primary transition-all duration-300 ease-in-out"
            style={{
                width: '50%',
                left: activeTab === 'saved' ? '0%' : '50%'
            }}
            />
        </div>

        <div className='fixed flex flex-row pt-4 '>
            <div id="saved-jobs" style={{ display: activeTab === 'saved' ? 'block' : 'none' }}>
            <SavedJobs />
            </div>
            <div id="applied-jobs" style={{ display: activeTab === 'applied' ? 'block' : 'none' }}>
            <AppliedJobs />
            </div>
          </div>
        </div>
      <GeneralFooter /></>
    </div>
  );
}