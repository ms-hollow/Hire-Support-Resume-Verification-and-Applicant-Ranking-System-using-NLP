import { formatVerificationStatusVerified } from "@/pages/utils/functions";

const VerifiedCredentials = ({ verificationResult }) => {
    const getVerifiedItems = (data) => {
        return data.filter(
            (item) =>
                item.verification_status &&
                item.verification_status
                    .trim()
                    .toLowerCase()
                    .startsWith("verified")
        );
    };

    const verifiedEducation = getVerifiedItems(
        verificationResult.education_verification || []
    );
    const verifiedCertifications = getVerifiedItems(
        verificationResult.certification_verification || []
    );

    const verifiedExperience = getVerifiedItems(
        verificationResult.experience_verification || []
    );

    return (
        <div className="flex flex-col pt-5 w-full">
            {/* Work Experience */}
            {verifiedExperience.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">
                            Work Experience
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {verifiedExperience.map((item, index) => (
                                <li key={index}>
                                    {item.company || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusVerified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Education */}
            {verifiedEducation.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">Education</p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {verifiedEducation.map((item, index) => (
                                <li key={index}>
                                    {item.course || "N/A"} |{" "}
                                    {item.school || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusVerified(
                                        item.verification_status
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Certifications */}
            {verifiedCertifications.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full pb-5">
                    <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg rounded-lg">
                        <p className="text-primary text-base pb-3">
                            Certifications
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin">
                            {verifiedCertifications.map((item, index) => (
                                <li key={index}>
                                    {item.certification || "N/A"} |{" "}
                                    {item.start_date || "N/A"} -{" "}
                                    {item.end_date || "N/A"} |{" "}
                                    {formatVerificationStatusVerified(
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

const VerifiedCredentialsWrapper = ({ verificationResult }) => {
    return (
        <div className="flex flex-col overflow-y-auto p-2 bg-background max-h-full">
            <VerifiedCredentials verificationResult={verificationResult} />
        </div>
    );
};

export default VerifiedCredentialsWrapper;
