import jwt from "jsonwebtoken";

export const getApplicantProfile = async (authTokens) => {
  if (!authTokens?.access) return null;

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/applicant/profile/view/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch applicant profile");
      return null;
    }

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
    const response = await fetch(
      "http://127.0.0.1:8000/applicant/profile/edit/",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const responseData = await response.json();
    // console.log("Response Data:", responseData);

    if (!response.ok) {
      console.error("Failed to update profile", responseData);
      return false;
    }

    console.log("Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
};
