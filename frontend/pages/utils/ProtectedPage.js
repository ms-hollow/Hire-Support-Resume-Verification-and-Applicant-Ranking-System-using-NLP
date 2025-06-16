import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

const ProtectedPage = ({ children }) => {
  // const { user, loading, authTokens } = useContext(AuthContext);
  // const router = useRouter();

  // useEffect(() => {
  //   // console.log('User:', user);
  //   // console.log('AuthTokens:', authTokens);
  //   if (!loading && !user && !authTokens) {
  //     router.push('/GENERAL/Login');
  //   }
  // }, [user, loading, authTokens, router]);

  // if (loading) {
  //   // Display loading spinner/message while loading
  //   return <div className="loading">Loading...</div>;
  // }

  return <>{children}</>; // Render protected content if authenticated
};

export default ProtectedPage;
