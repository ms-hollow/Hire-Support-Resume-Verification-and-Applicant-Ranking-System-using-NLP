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
        return tokens ? jwt.decode(tokens) : null;
    }
    return null;
    });
      
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const loginUser = async (e) => {
        e.preventDefault();
        
        // Kunin value sa Login form
        const email = e.target.username.value;
        const password = e.target.password.value;
        
        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        let response = await fetch('http://127.0.0.1:8000/users/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });
    
        let data = await response.json();
    
        // Check for response status and handle errors
        if (response.status === 200) {
            setAuthTokens(data);  // Save the tokens
    
            const decodedToken = jwt.decode(data.access);
            // console.log("Decoded Token:", decodedToken);
    
            setUser(decodedToken);  // Save user data
            localStorage.setItem("authTokens", JSON.stringify(data));  // Store tokens locally
    
            // Redirect based on user role
            const userRole = decodedToken.is_company ? "company" : decodedToken.is_applicant ? "applicant" : "unknown";
            // console.log(userRole);

            if (userRole === "company") {
                router.push("/GENERAL/Register");
            } else if (userRole === "applicant") {
                router.push("/APPLICANT/ApplicantHome");
            }
        } else {
            // Handle backend errors (email, password, etc.)
            if (response.status === 400) {
                alert(data.error || 'Invalid credentials');
            } else if (response.status === 404) {
                alert(data.error || 'Email does not exist');
            } else {
                alert("Something went wrong!");
            }
        }
    };
    
    const loginWithGoogle = async (response) => {
        try {
            // Send the Google token to the Django backend
            const tokenResponse = await fetch('http://127.0.0.1:8000/users/google-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential }),
            });
            
            const data = await tokenResponse.json();
            console.log("Access Token: ", data.access);
    
            if (tokenResponse.status === 200) {  // Check tokenResponse.status here
                setAuthTokens(data);
                
                const decodedToken = jwt.decode(data.access);
                console.log("Decoded Token:", decodedToken);
    
                setUser(decodedToken);
                localStorage.setItem("authTokens", JSON.stringify(decodedToken));
    
                // Check if there's a role in the decoded token
                const userRole = decodedToken.is_company
                    ? "company"
                    : decodedToken.is_applicant
                    ? "applicant"
                    : "unknown";
    
                console.log(userRole);

                // Redirect based on the user's role
                if (userRole === "company") {
                    router.push("/GENERAL/Register");
                } else if (userRole === "applicant") {
                    router.push("/APPLICANT/ApplicantHome");
                }
            } else {
                alert("Invalid Email or Password!");
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    }
    
    const logoutUser = () => {
        console.log('Logging out...');
        setAuthTokens(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authTokens');
        }
        router.push('/GENERAL/Login'); // Redirect to login after logout
    };

    const updateToken = async () => {
        if (!authTokens) {
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/users/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: authTokens?.refresh }),
        });
    
        const data = await response.json();
    
        if (response.status === 200) {
          setAuthTokens(data);
          setUser(jwt_decode(data.access));
          if (typeof window !== 'undefined') {
            localStorage.setItem('authTokens', JSON.stringify(data));
          }
        } else {
          logoutUser();
        }
    
        if (loading) {
          setLoading(false);
        }
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
        return () => clearInterval(interval);
      }, [authTokens, loading]);
    
        const contextData = {
        user,
        authTokens,
        loginUser,
        loginWithGoogle,
        logoutUser,
        };

    return (
        <AuthContext.Provider value={contextData}>
            {children} 
        </AuthContext.Provider>
        );
}

