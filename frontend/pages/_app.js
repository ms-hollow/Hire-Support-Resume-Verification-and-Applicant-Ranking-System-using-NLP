import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { useRouter } from "next/router";
import ProtectedPage from "./utils/ProtectedPage";

const clientId =
    "90810976706-fcmfefhfhdsdvk8an3lo5nd1899ss6mu.apps.googleusercontent.com";

export default function App({ Component, pageProps }) {
    const router = useRouter();

    // Pages that should not be protected
    const noAuthRequiredPages = [
        "/",
        "/GENERAL/Login",
        "/GENERAL/Register",
        "/GENERAL/ForgotPassword",
        // add here yung iba pang pages na hindi required iauthenticate
    ];

    const isNoAuthRequired = noAuthRequiredPages.includes(router.pathname);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                {isNoAuthRequired ? (
                    <Component {...pageProps} />
                ) : (
                    <ProtectedPage>
                        <Component {...pageProps} />
                    </ProtectedPage>
                )}
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
