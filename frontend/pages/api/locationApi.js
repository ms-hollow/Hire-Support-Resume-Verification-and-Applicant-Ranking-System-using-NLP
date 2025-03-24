export const fetchRegions = async () => {
  try {
    const response = await fetch("https://psgc.gitlab.io/api/regions/");
    if (!response.ok) throw new Error("Failed to fetch regions");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching regions:", error);
    return [];
  }
};

export const fetchProvinces = async (regionCode) => {
  if (!regionCode || regionCode === "130000000") return []; // Skip for NCR

  try {
    const response = await fetch(
      `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`
    );
    if (!response.ok) throw new Error("Failed to fetch provinces");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching provinces:", error);
    return [];
  }
};

export const fetchCities = async (provinceCode, regionCode) => {
  if (!provinceCode && regionCode !== "130000000") return []; // Skip if missing province (except NCR)

  const url =
    regionCode === "130000000"
      ? `https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`
      : `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch cities");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    return [];
  }
};

export const fetchBarangays = async (cityCode) => {
  if (!cityCode) return [];

  try {
    const response = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`
    );
    if (!response.ok) throw new Error("Failed to fetch barangays");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching barangays:", error);
    return [];
  }
};
