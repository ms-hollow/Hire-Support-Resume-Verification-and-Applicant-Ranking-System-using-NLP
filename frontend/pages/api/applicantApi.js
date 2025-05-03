import jwt from "jsonwebtoken";

export const getApplicantProfile = async (authTokens) => {
  if (!authTokens?.access) {
    console.error("No access token available for profile fetch");
    return null;
  }

  try {
    console.log("Fetching applicant profile with token (first 10 chars):", 
      authTokens.access.substring(0, 10) + "...");
      
    const response = await fetch(
      "http://127.0.0.1:8000/applicant/profile/view/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        credentials: 'include' // Include cookies if needed
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch applicant profile: ${response.status}`);
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
    
    // Add token data to the profile
    const tokenData = jwt.decode(authTokens.access);
    
    // Extract applicant_id specifically - this is critical for job applications
    let applicantId = null;
    if (data.profile_data && data.profile_data.applicant_id) {
      applicantId = data.profile_data.applicant_id;
    } else if (data.profile_data && data.profile_data.id) {
      applicantId = data.profile_data.id;
    } else if (tokenData && tokenData.applicant_id) {
      applicantId = tokenData.applicant_id;
    } else if (tokenData && tokenData.user_id) {
      console.log("No direct applicant_id found, but user_id is available in token");
    }
    
    console.log("Applicant ID from profile:", applicantId);
    
    // Combine profile data with token data and ensure applicant_id is set
    const profileData = {
      ...data.profile_data,
      email: tokenData?.email,
      applicant_id: applicantId,
    };
    
    console.log("Complete profile data:", profileData);
    return profileData;

  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    return null;
  }
};

export const updateApplicantProfile = async (authTokens, formData) => {
  if (!authTokens?.access) return false;

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/applicant/profile/edit/",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Include cookies if needed
      }
    );

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