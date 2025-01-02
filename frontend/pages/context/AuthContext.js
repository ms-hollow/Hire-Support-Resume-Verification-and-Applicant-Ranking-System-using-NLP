import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => {
        if (typeof window !== 'undefined') {
          const tokens = localStorage.getItem('authTokens');
          return tokens ? JSON.parse(tokens) : null;
        }
        return null;
      });
    
      const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
          const tokens = localStorage.getItem('authTokens');
          if (tokens) {
            const decodedToken = jwt.decode(tokens.access);
            return decodedToken ? decodedToken : null;
          }
        }
        return null;
      });

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const registerUser = async (userData) => {
        try {
            const response = await fetch('https://hire-support-resume-verification-and.onrender.com/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), 
            });
    
            const data = await response.json();
            
            if (response.ok) {
                // console.log('Registration successful:', data);
                setAuthTokens(data);
                
                if (data.access) {
                    const decodedToken = jwt.decode(data.access);
                    // console.log('Decoded Token:', decodedToken); 
                    
                    if (decodedToken) {
                        setUser(decodedToken); 
                        localStorage.setItem("authTokens", JSON.stringify(data));
                    } else {
                        console.log('Failed to decode token');
                    }
                } else {
                    console.log('Access token is missing');
                }
            } else {
                console.log('Registration failed:', data.error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };
    
    // Handle proceed to profile page if user decides to fill out profile details
    const handleProceed = async () => {
        if (authTokens) {
            if (user.is_applicant) {
                router.push("/APPLICANT/ApplicantProfile");
            } else if (user.is_company) {
                router.push("/GENERAL/Register"); //! Change and redirect to company profile
            } else {
                console.error("Unknown user role");
            }
        }
    };

    // Handle skip profile details if user wants to skip
    const handleSkip = async () => {
       if (authTokens) {
            if (user.is_applicant) {
                router.push("/APPLICANT/ApplicantHome");
            } else if (user.is_company) {
                router.push("/GENERAL/Login");  //! Change and redirect to company home 
            } else {
                console.error("Unknown user role");
            }
       }
    };
    
    const loginUser = async (e) => {
        e.preventDefault();

        const email = e.target.username.value;
        const password = e.target.password.value;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        let response = await fetch('https://hire-support-resume-verification-and.onrender.com/users/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password: password }),
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            const decodedToken = jwt.decode(data.access);
            setUser(decodedToken);
            localStorage.setItem("authTokens", JSON.stringify(data));

            // Redirect based on user role
            const userRole = decodedToken.is_company ? "company" : decodedToken.is_applicant ? "applicant" : "unknown";
            if (userRole === "company") {
                router.push("/GENERAL/Register"); //! Palitan ng company home
            } else if (userRole === "applicant") {
                router.push("/APPLICANT/ApplicantHome"); //! Palitan ng applicant home
            }
        } else {
            alert(data.error || 'Invalid credentials');
        }
    };

    const loginWithGoogle = async (response) => {
        try {
            const tokenResponse = await fetch('https://hire-support-resume-verification-and.onrender.com/users/google-login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.credential }),
            });

            const data = await tokenResponse.json();

            if (tokenResponse.status === 200) {
                setAuthTokens(data);
                const decodedToken = jwt.decode(data.access);
                setUser(decodedToken);
                localStorage.setItem("authTokens", JSON.stringify(data));

                const userRole = decodedToken.is_company ? "company" : decodedToken.is_applicant ? "applicant" : "unknown";

                if (userRole === "company") {
                    router.push("/GENERAL/Register");
                } else if (userRole === "applicant") {
                    router.push("/APPLICANT/ApplicantHome");
                }
            } else {
                alert("Invalid Email!");
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const logoutUser = () => {
        // console.log('Logging out...');
        setAuthTokens(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authTokens');
            localStorage.removeItem('savedJobs');
            localStorage.removeItem('job_title');
            localStorage.removeItem('jobId');
            localStorage.removeItem('company');
        }
        router.push('/GENERAL/Login'); // Redirect to login after logout
    };


    const updateToken = async () => {
        if (!authTokens) return;

        // console.log("Before update, authTokens:", authTokens);

        const response = await fetch('https://hire-support-resume-verification-and.onrender.com/users/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        });

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data); // Schedule state update
            setUser(jwt.decode(data.access)); // Decode and set user state
            localStorage.setItem('authTokens', JSON.stringify(data)); // Store in localStorage
            // console.log("Tokens received from refresh:", data); // Logs the response tokens
        } else {
            logoutUser();
            // console.log("Failed");
        }

        if (loading) setLoading(false);
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, 1000 * 60 * 4); // Every 4 minutes
        // * 60 * 5
        return () => clearInterval(interval);
    }, [authTokens, loading]);
    

    const contextData = {
        user,
        authTokens,
        loginUser,
        loginWithGoogle,
        logoutUser,
        registerUser,
        handleProceed,
        handleSkip
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};