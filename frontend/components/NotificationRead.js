import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const NotificationRead = () => {

    return(
        <div className="flex flex-col pt-6">
                <div className="flex flex-col items-center justify-center mx-60 w-[50vw]">
                <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                    <p className="text-fontcolor text-large">New application received</p>
                    <p className="text-fontcolor text-large ">Resume submitted for review.</p>
                </div>
                <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                    <p className="text-fontcolor text-large">Lorem Ipsum Dolor</p>
                    <p className="text-fontcolor text-large ">Your application on [company name]  has been rejected</p>
                </div>
                <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                    <p className="text-fontcolor text-large">There’s a new job hiring from [company name]</p>
                    <p className="text-fontcolor text-large ">Check [company name] new job hiring</p>
                </div>
                <div className="flex flex-col justify-left items-left notification-container px-8 py-4">
                    <p className="text-fontcolor text-large">Lorem ipsum dolor</p>
                    <p className="text-fontcolor text-large ">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
        </div>
    );
}

const NotificationReadWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <NotificationRead/>
        </div>
    );
};

export default NotificationReadWrapper;