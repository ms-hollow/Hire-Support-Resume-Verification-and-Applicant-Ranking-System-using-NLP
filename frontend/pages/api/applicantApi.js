import jwt from "jsonwebtoken";
import apiBaseUrl from "@/config/apiBaseUrl";

export const fetchApplicantProfile = async (authTokens) => {
    if (!authTokens?.access) return null;

    try {
        const response = await fetch(`${apiBaseUrl}/applicant/profile/view/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authTokens.access}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        return {
            ...data.profile_data,
            email: jwt.decode(authTokens.access)?.email,
        };
    } catch (error) {
        console.error("Error fetching applicant profile:", error);
        return null;
    }
};

export const updateApplicantProfile = async (authTokens, formData) => {
    if (!authTokens?.access) return false;

    try {
        const response = await fetch(`${apiBaseUrl}/applicant/profile/edit/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authTokens.access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include", // Include cookies if needed
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Failed to update profile", responseData);
            return false;
        }

        // console.log("Profile updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        return false;
    }
};
