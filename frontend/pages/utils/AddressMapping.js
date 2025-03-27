import { useState, useEffect } from "react";

export const useAddressMapping = () => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState({
    region: "",
    province: "",
    city: "",
    barangay: "",
  });

  const [savedLocation, setSavedLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionsData, provincesData, citiesData, barangaysData] =
          await Promise.all([
            fetch("https://psgc.gitlab.io/api/regions/").then((res) =>
              res.json()
            ),
            fetch("https://psgc.gitlab.io/api/provinces/").then((res) =>
              res.json()
            ),
            fetch("https://psgc.gitlab.io/api/cities-municipalities/").then(
              (res) => res.json()
            ),
            fetch("https://psgc.gitlab.io/api/barangays/").then((res) =>
              res.json()
            ),
          ]);
        setRegions(regionsData);
        setProvinces(provincesData);
        setCities(citiesData);
        setBarangays(barangaysData);
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchData();
  }, []);

  const getNameByCode = (code, dataset) => {
    const item = dataset.find((entry) => entry.code === code);
    return item ? item.name : "";
  };

  const saveLocation = () => {
    setSavedLocation({
      raw: { ...selectedLocation },
      converted: {
        regionName: getNameByCode(selectedLocation.region, regions),
        provinceName: getNameByCode(selectedLocation.province, provinces),
        cityName: getNameByCode(selectedLocation.city, cities),
        barangayName: getNameByCode(selectedLocation.barangay, barangays),
      },
    });
  };

  return {
    regions,
    provinces,
    cities,
    barangays,
    selectedLocation,
    setSelectedLocation,
    saveLocation,
    savedLocation,
  };
};
