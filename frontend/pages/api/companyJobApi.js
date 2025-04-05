export const fetchJobList = async (authTokens) => {
    if (!authTokens?.access) return null;

    try {
        const res = await fetch(
            "http://127.0.0.1:8000/job/job-hirings/company",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching job list:", error);
        return null;
    }
};

export const createJob = async (formData, token) => {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/job/hirings/create/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                "Failed to create job:",
                errorData.message || errorData.errors
            );
            return null;
        }

        const jobData = await response.json();
        return jobData;
    } catch (error) {
        console.error("Error creating job:", error);
        return null;
    }
};

export const deleteJobHiring = async (jobId, authTokens) => {
    if (!authTokens?.access) return null;

    try {
        const res = await fetch(
            `http://127.0.0.1:8000/job/hirings/delete/${jobId}`,
            {
                method: "DELETE", // Use DELETE method for deleting resources
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        if (res.status === 204) {
            return true;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error deleting job.", error);
        return null;
    }
};
