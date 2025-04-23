export function validateFormData(formData) {
    const totalWeight =
        parseFloat(formData.criteria.workExperience.weight || 0) +
        parseFloat(formData.criteria.skills.weight || 0) +
        parseFloat(formData.criteria.education.weight || 0) +
        parseFloat(formData.criteria.schools.weight || 0) +
        parseFloat(formData.criteria.certificates.weight || 0);

    if (totalWeight !== 100) {
        alert("Total weight of criteria must be equal to 100");
        return false;
    }

    const requiredFields = [
        {
            field: "weight_of_criteria",
            msg: "Please select a weight of criteria.",
        },
        {
            field: "verification_option",
            msg: "Please select a verification option.",
        },
        {
            field: "application_deadline",
            msg: "Please select an application deadline.",
        },
        { field: "additional_notes", msg: "Please add additional notes." },
    ];

    for (const { field, msg } of requiredFields) {
        if (!formData[field]) {
            alert(msg);
            return false;
        }
    }

    if (formData.required_documents.length === 0) {
        alert("Please select at least one required document.");
        return false;
    }

    return true;
}

export function handleInputChange(e, formData, setFormData) {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "weight_of_criteria") {
        switch (value) {
            case "Default Weight Percentage":
                updatedFormData.criteria.workExperience.weight = 25;
                updatedFormData.criteria.skills.weight = 25;
                updatedFormData.criteria.education.weight = 25;
                updatedFormData.criteria.certificates.weight = 25;
                break;
            case "Customize Criteria Weight Percentage":
                updatedFormData.criteria.workExperience.weight = "";
                updatedFormData.criteria.skills.weight = "";
                updatedFormData.criteria.education.weight = "";
                updatedFormData.criteria.certificates.weight = "";
                break;
            case "Experienced-Focused":
                updatedFormData.criteria.workExperience.weight = 40;
                updatedFormData.criteria.skills.weight = 20;
                updatedFormData.criteria.education.weight = 20;
                updatedFormData.criteria.certificates.weight = 20;
                break;
            case "Education-Focused":
                updatedFormData.criteria.workExperience.weight = 20;
                updatedFormData.criteria.skills.weight = 20;
                updatedFormData.criteria.education.weight = 40;
                updatedFormData.criteria.certificates.weight = 20;
                break;
            case "Skills-Focused":
                updatedFormData.criteria.workExperience.weight = 20;
                updatedFormData.criteria.skills.weight = 40;
                updatedFormData.criteria.education.weight = 20;
                updatedFormData.criteria.certificates.weight = 20;
                break;
        }
    }

    setFormData(updatedFormData);
}
