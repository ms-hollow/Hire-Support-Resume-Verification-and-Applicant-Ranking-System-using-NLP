export const toTitleCase = (str) => {
    if (!str) return str;
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatVerificationStatusUnverified = (status) => {
    if (!status) return "N/A";
    // Remove "unverified: " and capitalize the remaining text
    return status
        .replace("unverified: ", "")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


export const formatVerificationStatusVerified = (status) => {
    if (!status) return "N/A";
    // Remove "unverified: " and capitalize the remaining text
    return status
        .replace("verified: ", "")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};
