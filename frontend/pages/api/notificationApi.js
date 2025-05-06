import apiBaseUrl from "@/config/apiBaseUrl";
export async function getAllNotifications(token) {
    const res = await fetch(`${apiBaseUrl}/job/notifications/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
}

export async function markNotificationAsRead(id, token) {
    const res = await fetch(`${apiBaseUrl}/job/notifications/mark-as-read/${id}/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

export async function getUnreadNotifications(token) {
    const res = await fetch(`${apiBaseUrl}/notifications/unread/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return data.notifications;
}

export const deleteNotifications = async (token, ids) => {
    try {
        const response = await fetch(
            `${apiBaseUrl}/job/notifications/delete-notification/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ notification_ids: ids }),
            }
        );

        if (!response.ok) {
            console.log("Failed to delete notifications");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error during delete request:", error);
    }
};
