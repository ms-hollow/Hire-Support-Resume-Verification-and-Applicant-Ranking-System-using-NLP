import { useState, useEffect } from "react";

export const useAddressMapping = () => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/regions/")
            .then((res) => res.json())
            .then(setRegions)
            .catch(console.error);

        fetch("https://psgc.gitlab.io/api/provinces/")
            .then((res) => res.json())
            .then(setProvinces)
            .catch(console.error);

        fetch("https://psgc.gitlab.io/api/cities-municipalities/")
            .then((res) => res.json())
            .then(setCities)
            .catch(console.error);

        fetch("https://psgc.gitlab.io/api/barangays/")
            .then((res) => res.json())
            .then(setBarangays)
            .catch(console.error);
    }, []);

    const getNameByCode = (code, dataset) => {
        const item = dataset.find((entry) => entry.code === code);
        return item ? item.name : "Unknown";
    };

    const convertAddressCodes = (regionCode, provinceCode, cityCode, barangayCode) => {
        return {
            regionName: getNameByCode(regionCode, regions),
            provinceName: getNameByCode(provinceCode, provinces),
            cityName: getNameByCode(cityCode, cities),
            barangayName: getNameByCode(barangayCode, barangays),
        };
    };

    return { regions, provinces, cities, barangays, convertAddressCodes };
};