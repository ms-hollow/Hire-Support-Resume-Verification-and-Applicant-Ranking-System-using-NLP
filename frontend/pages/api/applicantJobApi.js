export const fetchJobListings = async (authToken) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/job/job-hirings/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch job listings");

        const data = await response.json();

        const sortedData = data
            .map((job) => ({
                job_id: job.job_hiring_id,
                job_title: job.job_title,
                company_name: job.company_name,
                job_industry: job.job_industry,
                job_description:
                    job.job_description || "No description available",
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_frequency: job.salary_frequency,
                employment_type: job.employment_type,
                schedule: job.schedule,
                location: `${job.region}, ${job.province}, ${job.city}`,
                work_setup: job.work_setup,
                experience_level: job.experience_level,
                creation_date: job.creation_date,
            }))
            .sort(
                (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
            );

        return sortedData;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
};

export const fetchSavedJobs = async (authToken) => {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/applicant/saved-jobs/",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) throw new Error("Failed to fetch saved jobs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        return [];
    }
};

export const saveJob = async (authToken, jobId) => {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/applicant/save-job/${jobId}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error("Failed to save job:", error);
        return false;
    }
};

export const unsaveJob = async (authToken, jobId) => {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/applicant/unsave-job/${jobId}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error("Failed to unsave job:", error);
        return false;
    }
};

export const fetchJobDetails = async (authToken, jobId) => {
    if (!jobId) return null;

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/job/hirings/${jobId}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();

        // Format salary
        const formattedSalary = data.salary
            ? `Php ${data.salary.min} - ${data.salary.max}`
            : "Not specified";

        // Format dates
        const formatDate = (dateString, format = "short") => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const year = date.getFullYear();

            if (format === "long") {
                const months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                return `${months[date.getMonth()]} ${day}, ${year}`;
            } else {
                return `${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                )}/${day}/${year}`;
            }
        };

        return {
            ...data,
            salary: formattedSalary,
            creation_date: formatDate(data.creation_date, "short"),
            application_deadline: formatDate(data.application_deadline, "long"),
        };
    } catch (error) {
        console.error("Error fetching job details:", error);
        return null;
    }
};

export const getAllJobApplications = async (authToken) => {
    try {
        const res = await fetch(
            "http://127.0.0.1:8000/job/applications/get-all-applications/",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!res.ok) throw new Error("Failed to fetch job applications");

        const data = await res.json();

        const sortedData = [...data].sort(
            (a, b) =>
                new Date(b.application_date) - new Date(a.application_date)
        );

        return sortedData;
    } catch (error) {
        console.log("Error fetching job details:", error);
        return null;
    }
};


export const submitJobApplication = async (authToken, applicationData, documentFiles, documentTypes) => {
    if (!authToken) {
      console.error("No access token available.");
      return null;
    }
  
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      
      // Add application data
      Object.keys(applicationData).forEach(key => {
        formData.append(key, applicationData[key]);
      });
      
      // Add document types
      documentTypes.forEach(type => {
        formData.append('document_type', type);
      });
      
      // Add document files
      documentFiles.forEach(file => {
        formData.append('document_file', file);
      });
      
      const response = await fetch("http://127.0.0.1:8000/job/applications/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to submit application:", errorData);
        return { success: false, error: errorData };
      }
      
      const responseData = await response.json();
      return { success: true, data: responseData };
    } catch (error) {
      console.error("Error submitting job application:", error);
      return { success: false, error: error.message };
    }
};
