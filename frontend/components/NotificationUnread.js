import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const NotificationUnread = () => {

        return(
            <div className="flex flex-col pt-6">
                  <div className="flex flex-col items-center justify-center mx-60 w-[50vw]">
                    <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                        <b className="text-fontcolor text-large">New application received</b>
                        <b className="text-fontcolor text-large ">Resume submitted for review.</b>
                    </div>
                    <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                        <b className="text-fontcolor text-large">Lorem Ipsum Dolor</b>
                        <b className="text-fontcolor text-large ">Your application on [company name]  has been rejected</b>
                    </div>
                    <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                        <b className="text-fontcolor text-large">There’s a new job hiring from [company name]</b>
                        <b className="text-fontcolor text-large ">Check [company name] new job hiring</b>
                    </div>
                    <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                        <b className="text-fontcolor text-large">Lorem ipsum dolor</b>
                        <b className="text-fontcolor text-large ">Lorem ipsum dolor sit amet</b>
                    </div>



                </div>
            </div>






        );




}

const NotificationUnreadWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <NotificationUnread/>
        </div>
    );
};

export default NotificationUnreadWrapper;