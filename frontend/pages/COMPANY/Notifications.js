import { useState } from 'react';
import GeneralFooter from '@/components/GeneralFooter';
import Image from 'next/image';
import CompanyHeader from '@/components/CompanyHeader';


export default function Notifications() {
    const [activeTab, setActiveTab] = useState('read');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedNotifs, setSelectedNotifs] = useState({ 1: false }); // key: notif ID or index
  
    const handleSelectAll = () => {
      const newState = !selectAll;
      setSelectAll(newState);
  
      // Update all to match selectAll
      const updatedSelections = {};
      Object.keys(selectedNotifs).forEach((key) => {
        updatedSelections[key] = newState;
      });
      setSelectedNotifs(updatedSelections);
    };
  
    const handleCheckboxChange = (key) => {
      setSelectedNotifs((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };
  
    
    return (
      <div>
            <><CompanyHeader/>
                <div className="lg:pt-28 mb:pt-24 sm:pt-24 xsm:pt-24 xxsm:pt-24 lg:px-20 mb:px-10 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto pb-8">
                    <div className="text-lg text-primary">
                        <b>Notifications</b>
                    </div>

                    <div className="flex flex-col w-full pt-5">
                        {/* Top Controls */}
                        <div className="flex flex-row items-center justify-between ">
                            <div className="flex items-center justify-center gap-3 ml-4"> 
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 align-middle"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex flex-row">
                                    <Image src="/Delete.png" width={25} height={25} alt="Delete Icon" className="delete-icon"/>
                                    <p className="text-primary font-light px-5"> 1-10 out of 30</p>
                                    <Image 
                                        src="/chevron-left.svg" 
                                        width={25} 
                                        height={25} 
                                        alt="Arrow left" 
                                        className="chevron-icon"
                                    />
                                    <Image 
                                        src="/chevron-right.svg" 
                                        width={25} 
                                        height={25} 
                                        alt="Arrow Right" 
                                        className="chevron-icon1"
                                    />
                                </div>   
                            </div>
                        </div>
                    
                        {/* Notifications Read */}
                        <div className="flex flex-col w-full">
                            <div className="w-full px-4 py-3 bg-white shadow-lg hover:border-2 flex items-start gap-3">
                            {/* Original Notification Content - UNCHANGED */}
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row items-center gap-3 w-full">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 align-middle"
                                />
                                <Image
                                    src="/Notification Icon 1.svg"
                                    width={39}
                                    height={30}
                                    alt="Notification Icon"
                                />
                    
                                {/* Read */}
                                <div className="flex items-center justify-between w-full overflow-hidden">
                                    <p className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall leading-snug truncate">
                                    Hi there,
                                    <span className="font-bold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall"> [Company Name] </span>
                                    <span className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-thin">
                                        {" "}
                                        - There is a new applicantion for [Position]. Check your new applicants!
                                    </span>
                                    </p>
                                    <p className="text-xs text-gray-400 flex-shrink-0 pl-4">10:30 AM</p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        {/* Notifications Unread */}
                        <div className="flex flex-col w-full">
                            <div className="w-full px-4 py-3 bg-[#F1F1F1] shadow-lg hover:border-2  flex items-start gap-3">
                            {/* Original Notification Content - UNCHANGED */}
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row items-center gap-3 w-full">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 align-middle"
                                />
                                <Image
                                    src="/Notification Icon 1.svg"
                                    width={39}
                                    height={30}
                                    alt="Notification Icon"
                                />
                                <div className="flex items-center justify-between w-full overflow-hidden">
                                    <p className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall leading-snug truncate">
                                    Hi there,
                                    <span className="font-bold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall"> [Applicant Name] </span>
                                    <span className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-thin">
                                        {" "}
                                        - There is a new applicantion for [Position]. Check your new applicants!
                                    </span>
                                    </p>
                                    <p className="text-xs text-gray-400 flex-shrink-0 pl-4">10:30 AM</p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            <GeneralFooter/></>
      </div>
    );
}