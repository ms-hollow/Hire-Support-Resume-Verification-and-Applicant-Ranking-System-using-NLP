import { formatVerificationStatusUnverified } from "@/pages/utils/functions";

const UnerifiedCredentials = ({ verificationResult }) => {
    const getUnverifiedItems = (data) => {
        if (!Array.isArray(data)) {
            return []; 
        }
        return data.filter(
            (item) =>
                item.verification_status &&
                item.verification_status
                    .trim()
                    .toLowerCase()
                    .startsWith("unverified")
        );
    };

    // Extract unverified data for each category
    const unverifiedEducation = getUnverifiedItems(
        verificationResult.education_verification || []
    );
    const unverifiedCertifications = getUnverifiedItems(
        verificationResult.certification_verification || []
    );
    const unverifiedExperience = getUnverifiedItems(
        verificationResult.experience_verification || []
    );
    const unverifiedResume = getUnverifiedItems(
        verificationResult.resume_verification || []
    );

    return (
        <div className="flex flex-col pt-5 w-full">
            {/* Work Experience */}
            {unverifiedExperience.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">
                            Work Experience
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {unverifiedExperience.map((item, index) => (
                                <li key={index}>
                                    {item.company || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusUnverified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Education */}
            {unverifiedEducation.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">Education</p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {unverifiedEducation.map((item, index) => (
                                <li key={index}>
                                    {item.course || "N/A"} |{" "}
                                    {item.school || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusUnverified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Certifications */}
            {unverifiedCertifications.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">
                            Certifications
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {unverifiedCertifications.map((item, index) => (
                                <li key={index}>
                                    {item.certification || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusUnverified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Resume */}
            {verificationResult.resume_verification && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">Resume</p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {unverifiedResume.map((item, index) => (
                                <li key={index}>
                                    {formatVerificationStatusUnverified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const UnverifiedCredentialsWrapper = ({ verificationResult }) => {
    return (
        <div className="flex flex-col overflow-y-auto p-2 max-h-full bg-background">
            <UnerifiedCredentials verificationResult={verificationResult} />
        </div>
    );
};

export default UnverifiedCredentialsWrapper;
