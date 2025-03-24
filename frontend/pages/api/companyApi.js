import jwt from "jsonwebtoken";

export const getCompany = async (authTokens) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/company/profile/view", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch company data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching company details:", error);
    return null;
  }
};

export const getCompanyProfile = async (authTokens) => {
  if (!authTokens?.access) return null;

  const token = authTokens.access;
  const decodedToken = jwt.decode(token);

  try {
    const res = await fetch("http://127.0.0.1:8000/company/profile/view/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        ...data.profile_data,
        email: decodedToken.email,
      };
    } else {
      console.error(`Error fetching company profile: ${res.status}`);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};

export const updateCompanyProfile = async (authTokens, formData) => {
  if (!authTokens?.access) return false;

  try {
    const res = await fetch("http://127.0.0.1:8000/company/profile/edit/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      return true; // Successfully updated
    } else {
      console.error("Error updating profile");
      return false;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return false;
  }
};
