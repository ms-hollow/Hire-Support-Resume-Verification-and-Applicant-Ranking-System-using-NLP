export const toTitleCase = (str) => {
    if (!str) return ""; // 👈 if str is null/undefined, return empty string
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};