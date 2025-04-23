export const initialFormData = {
    required_documents: [],
    application_deadline: "",
    weight_of_criteria: "",
    verification_option: "",
    additional_notes: "",
    criteria: {
        workExperience: {
            directlyRelevant: [],
            highlyRelevant: [],
            moderatelyRelevant: [],
            weight: "",
        },
        skills: {
            primarySkills: [],
            secondarySkills: [],
            additionalSkills: [],
            weight: "",
        },
        education: {
            weight: "",
            firstChoice: [],
            secondChoice: [],
            thirdChoice: [],
        },
        schools: {
            schoolPreference: [],
        },
        additionalPoints: {
            honor: "",
            multipleDegrees: "",
        },
        certificates: {
            preferred: [],
            weight: "",
        },
    },
    criteria_weights: {
        work_experience: 100,
        skills: 100,
        education: 100,
        additional_points: 100,
        certifications: 100,
    },
};

export const mergeData = (formData, parsedStoredData) => {
    return {
        ...parsedStoredData,
        required_documents: formData.required_documents,
        application_deadline: formData.application_deadline,
        weight_of_criteria: formData.weight_of_criteria,
        verification_option: formData.verification_option,
        additional_notes: formData.additional_notes,
        scoring_criteria: [
            {
                criteria_name: "Work Experience",
                weight_percentage: formData.criteria.workExperience.weight,
                preference: {
                    directlyRelevant:
                        formData.criteria.workExperience.directlyRelevant,
                    highlyRelevant:
                        formData.criteria.workExperience.highlyRelevant,
                    moderatelyRelevant:
                        formData.criteria.workExperience.moderatelyRelevant,
                },
            },
            {
                criteria_name: "Skills",
                weight_percentage: formData.criteria.skills.weight,
                preference: {
                    primarySkills: formData.criteria.skills.primarySkills,
                    secondarySkills: formData.criteria.skills.secondarySkills,
                    additionalSkills: formData.criteria.skills.additionalSkills,
                },
            },
            {
                criteria_name: "Education",
                weight_percentage: formData.criteria.education.weight,
                preference: {
                    firstChoice: formData.criteria.education.firstChoice,
                    secondChoice: formData.criteria.education.secondChoice,
                    thirdChoice: formData.criteria.education.thirdChoice,
                },
            },
            {
                criteria_name: "Schools",
                weight_percentage: formData.criteria.schools.weight,
                preference: {
                    schoolPreference:
                        formData.criteria.schools.schoolPreference,
                },
            },
            {
                criteria_name: "Additional Points",
                weight_percentage: formData.criteria.additionalPoints.weight,
                preference: {
                    honor: formData.criteria.additionalPoints.honor,
                    multipleDegrees:
                        formData.criteria.additionalPoints.multipleDegrees,
                },
            },
            {
                criteria_name: "Certifications",
                weight_percentage: formData.criteria.certificates.weight,
                preference: {
                    preferred: formData.criteria.certificates.preferred,
                },
            },
        ],
    };
};
