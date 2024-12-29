import { createContext, useState, useContext } from "react";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [jobDetails, setJobDetails] = useState(null);

    return (
        <JobContext.Provider value={{ jobDetails, setJobDetails }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobContext = () => useContext(JobContext);
