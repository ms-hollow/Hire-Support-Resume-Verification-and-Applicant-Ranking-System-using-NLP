export const validateJobForm = (formData) => {
    if (!formData) return { formData: "Form data is required." }; 

    const errors = {};

    const requiredFields = [
        ["job_title", "Job title is required."],
        ["job_industry", "Job industry is required."],
        ["schedule", "Schedule is required."],
        ["job_description", "Job description is required."],
        ["region", "Region is required."],
        ["province", "Province is required."],
        ["city", "City is required."],
    ];

    requiredFields.forEach(([key, message]) => {
        if (!formData[key]) errors[key] = message;
    });

    if (!formData.specialization?.length) {
        errors.specialization = "Specialization is required.";
    }

    if (!formData.required_documents?.length) {
        errors.required_documents =
            "Please select at least one required document.";
    }

    const min = Number(formData.salary_min);
    const max = Number(formData.salary_max);

    if (min < 0 || max < 0) errors.salary = "Salary cannot be negative.";
    if (min < 20)
        errors.salary_min = "Minimum salary must not be less than 20.";
    if (max > 1000000)
        errors.salary_max = "Maximum salary must not exceed 1,000,000.";
    if (min >= max)
        errors.salary = "Minimum salary must be less than maximum salary.";

    const totalWeight = [
        "workExperience",
        "skills",
        "education",
        "schools",
        "certificates",
    ].reduce(
        (sum, key) => sum + parseFloat(formData.criteria?.[key]?.weight || 0),
        0
    );

    if (totalWeight !== 100) {
        errors.criteria_total =
            "Total weight of criteria must be equal to 100.";
    }

    const moreRequired = [
        ["weight_of_criteria", "Please select a weight of criteria."],
        ["verification_option", "Please select a verification option."],
        ["application_deadline", "Please select an application deadline."],
        ["additional_notes", "Please add additional notes."],
    ];

    moreRequired.forEach(([key, message]) => {
        if (!formData[key]) errors[key] = message;
    });

    return errors;
};
