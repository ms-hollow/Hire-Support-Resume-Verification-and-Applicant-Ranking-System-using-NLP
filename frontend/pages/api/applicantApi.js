import jwt from "jsonwebtoken";
import apiBaseUrl from "@/config/apiBaseUrl";

export const getApplicantProfile = async (authTokens) => {
    if (!authTokens?.access) {
        console.error("No access token available for profile fetch");
        return null;
    }

    try {
        console.log(
            "Fetching applicant profile with token (first 10 chars):",
            authTokens.access.substring(0, 10) + "..."
        );

        const response = await fetch(
            "http://127.0.0.1:8000/applicant/profile/view/",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies if needed
            }
        );

        if (!response.ok) {
            console.error(
                `Failed to fetch applicant profile: ${response.status}`
            );
            // Try to get error details
            try {
                const errorData = await response.json();
                console.error("Error details:", errorData);
            } catch (e) {
                console.error("Could not parse error response");
            }
            return null;
        }

        const data = await response.json();

        // Extract user ID from token to use as applicant ID
        const tokenData = jwt.decode(authTokens.access);
        const userId = tokenData?.user_id;

        console.log("User ID from token:", userId);

        // Create a simple profile data object
        const profileData = {
            ...data.profile_data,
            email: tokenData?.email,
            user_id: userId,
            applicant_id: data.profile_data.id, // This should be the applicant ID from your database
        };

        console.log("Complete profile data:", profileData);
        return profileData;
    } catch (error) {
        console.error("Error fetching applicant profile:", error);
        return null;
    }
};

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
