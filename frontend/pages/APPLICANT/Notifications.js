import { useState } from 'react';
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from '@/components/GeneralFooter';
import NotificationRead from "@/components/NotificationRead";
import NotificationUnread from "@/components/NotificationUnread";
import Image from 'next/image';


export default function Notifications() {
    const [activeTab, setActiveTab] = useState('read');
    
    return (
      <div>
            <><ApplicantHeader/>
                <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-20 xsm:px-20 lg:px-20 mx-auto">
                    <div className="-mt-5 -mx-20 text-lg text-primary md:px-20 sm:px-8 xsm:px-8">
                        <b>Notifications</b>
                    </div>
                    <div className="flex flex-wrap w-full flex-row justify-between mt-5">
                         {/* Read */}
                        <p className={`text-fontcolor font-normal cursor-pointer ml-[11rem] ${activeTab === 'read' ? 'text-primary' : ''}`}
                            onClick={() => setActiveTab('read')}
                            >Read
                        </p>

                        {/* Unread */}
                        <p className={`text-fontcolor font-normal cursor-pointer  ${activeTab === 'unread' ? 'text-primary' : ''}`}
                            onClick={() => setActiveTab('unread')}
                            >Unread
                        </p>
                        <div className="flex flex-row">
                            <Image src="/Delete.png" width={20} height={20} alt="Delete Icon" className="delete-icon"/>
                            <p className="text-primary font-light px-5">
                                1-10 out of 30
                            </p>
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
                    <div className="-mt-2">
                        {/* static underline */}
                        <div className="relative w-full">
                            <div className=" h-[1px] bg-primary"></div>
                        </div>
                        {/* dynamic underline */}
                        <div className="relative">
                            <div className="absolute bottom-0 h-[5px] bg-primary transition-all duration-300 ease-in-out"
                                style={{
                                    width: '33%',
                                    left: activeTab === 'read' ? '0%' : '33%'
                                }}
                            />
                        </div>
                    </div>
                    <div className='fixed flex flex-row pt-4 '>
                        <div id="saved-jobs" style={{ display: activeTab === 'read' ? 'block' : 'none' }}>
                            <NotificationRead />
                        </div>
                        <div id="applied-jobs" style={{ display: activeTab === 'unread' ? 'block' : 'none' }}>
                            <NotificationUnread />
                        </div>
                    </div>
                </div>
            <GeneralFooter/></>
      </div>
    );
}