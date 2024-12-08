import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedPage = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/GENERAL/Login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  // Show a loading spinner while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedPage;
