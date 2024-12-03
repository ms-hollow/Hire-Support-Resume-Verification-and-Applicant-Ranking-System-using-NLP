import "@/styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '90810976706-fcmfefhfhdsdvk8an3lo5nd1899ss6mu.apps.googleusercontent.com';

export default function App({ Component, pageProps }) {
  return (
      <GoogleOAuthProvider clientId={clientId}>
          <Component {...pageProps} />
      </GoogleOAuthProvider>
  );
}
