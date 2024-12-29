import { createContext, useContext, useState } from "react";

const ApplicantContext = createContext();

export const ApplicantProvider = ({ children }) => {
    const [applicantDetails, setApplicantDetails] = useState(null);

    return (
        <ApplicantContext.Provider value={{ applicantDetails, setApplicantDetails }}>
            {children}
        </ApplicantContext.Provider>
    );
};

export const useApplicantContext = () => useContext(ApplicantContext);
