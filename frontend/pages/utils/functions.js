export const toTitleCase = (str) => {
<<<<<<< HEAD
    if (!str) return ""; // 👈 if str is null/undefined, return empty string
=======
    if (!str) return str;
>>>>>>> origin/main
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};