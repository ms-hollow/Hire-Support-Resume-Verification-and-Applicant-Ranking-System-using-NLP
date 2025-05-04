import { useState, useEffect, useContext } from "react";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import CompanyHeader from "@/components/CompanyHeader";
import AuthContext from "../context/AuthContext";
import {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotifications,
} from "../api/notificationApi";
import { getCompanyProfile } from "../api/companyApi";
import { getApplicationDetails } from "../api/companyJobApi";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { toast } from "react-toastify";
import ToastWrapper from "@/components/ToastWrapper";
import { useRouter } from "next/router";

export default function Notifications() {
    let { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [selectedNotifs, setSelectedNotifs] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getCompanyProfile(authTokens);
                setCompanyName(profile.company_name);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const notifications = await getAllNotifications(
                    authTokens?.access
                );
                setNotifications(notifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        if (authTokens) {
            fetchProfile();
            fetchNotifications();
        }
    }, [authTokens]);

    // Calculate total pages
    const totalPages = Math.ceil(notifications.length / pageSize);

    // Get the notifications for the current page
    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleMarkAsRead = async (notif_id) => {
        const notification = notifications.find(
            (notif) => notif.id === notif_id
        );
        let job_application_id = notification.job_application;

        try {
            await markNotificationAsRead(notif_id, authTokens?.access);
            const updatedNotifications = notifications.map((notif) =>
                notif.id === notif_id ? { ...notif, is_read: true } : notif
            );
            setNotifications(updatedNotifications);

            const res = await getApplicationDetails(
                job_application_id,
                authTokens
            );

            let id = res.job_hiring;
            let applicant = res.job_application_id;

            router.push({
                pathname: "/COMPANY/IndividualApplicantDetails",
                query: { id, applicant },
            });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleDeleteNotification = async () => {
        const selectedIds = Object.keys(selectedNotifs).filter(
            (key) => selectedNotifs[key]
        );

        if (selectedIds.length === 0) {
            return;
        }

        try {
            await deleteNotifications(authTokens?.access, selectedIds);

            const updated = notifications.filter(
                (notif) => !selectedIds.includes(String(notif.id))
            );
            setNotifications(updated);
            setSelectedNotifs({});
            setSelectAll(false);
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete notifications:", error);
        }
    };

    const handleSelectAll = () => {
        const newState = !selectAll;
        setSelectAll(newState);

        const updatedSelections = {};
        paginatedNotifications.forEach((notif) => {
            updatedSelections[notif.id] = newState;
        });

        setSelectedNotifs((prev) => ({
            ...prev,
            ...updatedSelections,
        }));
    };

    const handleCheckboxChange = (key) => {
        setSelectedNotifs((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage); // Update current page
        }
    };

    return (
        <div>
            <>
                <CompanyHeader />
                <ToastWrapper />
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
                                    <Image
                                        src="/Delete.png"
                                        width={25}
                                        height={25}
                                        alt="Delete Icon"
                                        className="delete-icon cursor-pointer"
                                        onClick={() =>
                                            setIsDeleteModalOpen(true)
                                        }
                                    />
                                    <p className="text-primary font-light px-5">
                                        {` ${
                                            (currentPage - 1) * pageSize + 1
                                        } - ${Math.min(
                                            currentPage * pageSize,
                                            notifications.length
                                        )} out of ${notifications.length}`}
                                    </p>
                                    <Image
                                        src="/chevron-left.svg"
                                        width={25}
                                        height={25}
                                        alt="Arrow left"
                                        className="chevron-icon cursor-pointer"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                    />
                                    <Image
                                        src="/chevron-right.svg"
                                        width={25}
                                        height={25}
                                        alt="Arrow Right"
                                        className="chevron-icon1 cursor-pointer"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex flex-col w-full">
                            {paginatedNotifications.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    No notifications available at the moment.
                                </div>
                            ) : (
                                paginatedNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() =>
                                            handleMarkAsRead(notif.id)
                                        }
                                        className={`w-full px-4 py-3 shadow-lg hover:border-2 flex items-start gap-3 ${
                                            notif.is_read
                                                ? "bg-gray-200"
                                                : "bg-white"
                                        }`}
                                    >
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-row items-center gap-3 w-full">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedNotifs[
                                                            notif.id
                                                        ] || false
                                                    }
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            notif.id
                                                        )
                                                    }
                                                    className="w-4 h-4 align-middle"
                                                />
                                                <Image
                                                    src="/Notification Icon 1.svg"
                                                    width={39}
                                                    height={30}
                                                    alt="Notification Icon"
                                                />
                                                <div className="flex items-center justify-between w-full overflow-hidden cursor-pointer">
                                                    <p className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall leading-snug truncate">
                                                        Hi there,
                                                        <span className="font-bold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                                                            {" "}
                                                            {companyName}{" "}
                                                        </span>
                                                        <span className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-thin">
                                                            {" "}
                                                            - {notif.message}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 flex-shrink-0 pl-4">
                                                        {new Date(
                                                            notif.created_at
                                                        ).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteNotification}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />

                <GeneralFooter />
            </>
        </div>
    );
}
