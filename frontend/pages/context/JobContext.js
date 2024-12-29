import { createContext, useState, useContext } from "react";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [job, setJob] = useState(null);

    return (
        <JobContext.Provider value={{ job, setJob}}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobContext = () => useContext(JobContext);