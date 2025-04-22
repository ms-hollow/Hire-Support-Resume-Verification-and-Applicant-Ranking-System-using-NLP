import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function useFetchOptions() {
    const [options, setOptions] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/placeHolder/dummy_options.json");
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchData();
    }, []);

    return [options, setOptions];
}

export function useFormData(setFormData) {
    useEffect(() => {
        const storedData = Cookies.get("SERIALIZED_DATA");
        let parsedStoredData;

        if (!storedData) {
            return;
        }

        try {
            parsedStoredData = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            required_documents: parsedStoredData?.required_documents || [],
            application_deadline: parsedStoredData?.application_deadline || "",
            verification_option: parsedStoredData?.verification_option || "",
            weight_of_criteria: parsedStoredData?.weight_of_criteria || "",
            additional_notes: parsedStoredData?.additional_notes || "",
            criteria: {
                ...prevData.criteria,
                workExperience: {
                    ...prevData.criteria.workExperience,
                    directlyRelevant:
                        parsedStoredData.scoring_criteria[0]?.preference
                            ?.directlyRelevant || [],
                    highlyRelevant:
                        parsedStoredData.scoring_criteria[0]?.preference
                            ?.highlyRelevant || [],
                    moderatelyRelevant:
                        parsedStoredData.scoring_criteria[0]?.preference
                            ?.moderatelyRelevant || [],
                    weight:
                        parsedStoredData.scoring_criteria[0]
                            ?.weight_percentage || "",
                },
                skills: {
                    ...prevData.criteria.skills,
                    primarySkills:
                        parsedStoredData.scoring_criteria[1]?.preference
                            ?.primarySkills || [],
                    secondarySkills:
                        parsedStoredData.scoring_criteria[1]?.preference
                            ?.secondarySkills || [],
                    additionalSkills:
                        parsedStoredData.scoring_criteria[1]?.preference
                            ?.additionalSkills || [],
                    weight:
                        parsedStoredData.scoring_criteria[1]
                            ?.weight_percentage || "",
                },
                education: {
                    ...prevData.criteria.education,
                    firstChoice:
                        parsedStoredData.scoring_criteria[2]?.preference
                            ?.firstChoice || [],
                    secondChoice:
                        parsedStoredData.scoring_criteria[2]?.preference
                            ?.secondChoice || [],
                    thirdChoice:
                        parsedStoredData.scoring_criteria[2]?.preference
                            ?.thirdChoice || [],
                    weight:
                        parsedStoredData.scoring_criteria[2]
                            ?.weight_percentage || "",
                },
                schools: {
                    ...prevData.criteria.schools,
                    schoolPreference:
                        parsedStoredData.scoring_criteria[3]?.preference
                            ?.schoolPreference || [],
                },
                additionalPoints: {
                    ...prevData.criteria.additionalPoints,
                    honor:
                        parsedStoredData.scoring_criteria[4]?.preference
                            ?.honor || "0",
                    multipleDegrees:
                        parsedStoredData.scoring_criteria[4]?.preference
                            ?.multipleDegrees || "0",
                },
                certificates: {
                    ...prevData.criteria.certificates,
                    preferred:
                        parsedStoredData.scoring_criteria[5]?.preference
                            ?.preferred || [],
                    weight:
                        parsedStoredData.scoring_criteria[5]
                            ?.weight_percentage || "",
                },
            },
        }));
    }, [setFormData]);
}
