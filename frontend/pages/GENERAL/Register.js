import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useContext } from "react";
import GeneralHeader from "@/components/GeneralHeader";
import GeneralFooter from "@/components/GeneralFooter";
import PersonalInfo from "@/components/PersonalInfo";
import CompanyInfo from "@/components/CompanyInfo";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import ToastWrapper from "@/components/ToastWrapper";

//TODO 1. Change routes 2. Setup show password
//TODO Add CompanyInfo if company ang nag register

export default function Register() {
    const [step, setStep] = useState(0); // Tracks the current step
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isEditable] = useState(false);

    const [isCompany, setCompany] = useState(false);
    const [isApplicant, setApplicant] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const { registerUser } = useContext(AuthContext);
    // const { handleProceed, handleSkip, user, loading } =
    //     useContext(AuthContext);
    
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);

    const router = useRouter();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleShowPersonalInfo = () => {
        if (isApplicant) {
            setShowPersonalInfo(true);
        } else if (isCompany) {
            setShowCompanyInfo(true);
        } else {
            console.log("No valid role detected.");
        }
    };

    const setRole = (role) => {
        if (!role) {
            toast.error("Please select a role");
            return;
        }

        let newIsCompany = false;
        let newIsApplicant = false;

        if (role === "company") {
            newIsCompany = true;
            newIsApplicant = false;
            handleNextStep();
        } else if (role === "applicant") {
            newIsCompany = false;
            newIsApplicant = true;
            handleNextStep();
        }

        setCompany(newIsCompany);
        setApplicant(newIsApplicant);

        //? Test
        // console.log('Selected role:', role);
        // console.log('Is Applicant?', newIsApplicant);
        // console.log('Is Company?', newIsCompany);
    };

    const handleEmailChange = (e) => {
        setEmailAddress(e.target.value);
    };

    const getEmail = async () => {
      // Validate email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailAddress) {
        toast.error("Please input an email address.");
        return;
      }

      if (!emailRegex.test(emailAddress)) {
        toast.error("Please input a valid email address.");
        return;
      }

      handleNextStep(); // Proceed to the next step

      // try {
      //     const emailCheckResponse = await fetch(
      //         "http://127.0.0.1:8000/users/check-email/",
      //         {
      //             method: "POST",
      //             headers: {
      //                 "Content-Type": "application/json",
      //             },
      //             body: JSON.stringify({ email: emailAddress }), // Convert the email to JSON format
      //         }
      //     );

      //     // Check if the response status is 409 Conflict (email already exists)
      //     if (emailCheckResponse.status === 409) {
      //         toast.info("This email is already registered.");
      //         setEmailAddress(""); // Clear the email input so user can re-enter
      //         return;
      //     }

      //     // If the response is successful (status 200), parse the response data
      //     if (emailCheckResponse.ok) {
      //         const responseData = await emailCheckResponse.json(); // Parse the response as JSON

      //         // If the server indicates the email exists, notify the user
      //         if (responseData.exists) {
      //             toast.info("This email is already registered.");
      //             setEmailAddress(""); // Clear the email input
      //             return;
      //         }

      //         // Check if the checkbox is checked
      //         if (!isChecked) {
      //             toast.error("You must check the checkbox.");
      //             return; // Prevent further execution
      //         } else {
      //             handleNextStep(); // Proceed to the next step
      //         }
      //     } else {
      //         toast.error("Error checking email. Please try again.");
      //     }
      // } catch (error) {
      //     toast.error(
      //         "Network error. Please check your connection and try again."
      //     );
      // }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const getPassword = () => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Check if password and confirmPassword are provided
        if (!password || !confirmPassword) {
            toast.warning("Please input both password and confirm password.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error(
                "Your passwords don't match. Please make sure both passwords are the same."
            );
            return;
        }

        // Validate password strength
        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character."
            );
            return;
        }

        // If all checks pass, proceed
        handleSubmit(); // Handle Submit will register the user
        handleNextStep(); // Proceed to next step: Profile Form
    };

    const handleSubmit = async () => {
        // const userData = {
        //     email: emailAddress,
        //     password: password,
        //     is_company: isCompany,
        //     is_applicant: isApplicant,
        // };
        // registerUser(userData);
        router.push("/APPLICANT/ApplicantHome"); // Redirect to dashboard after registration
    };

    const handleNextStep = () => {
        // Increment the step if role is selected
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1); // Move to the previous step
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="pb-20">
            <GeneralHeader />
            <div className="flex items-center justify-center lg:pt-36 mb:pt-24 xsm:pt-24 xxsm:pt-24 sm:pt-24 mb:p-8 sm:p-8 xsm:p-8 xxsm:p-4 py-8 mx-auto">
                {/* Step 0: Selection Buttons */}
                {step === 0 && (
                    <div className="job-application-box rounded-xs px-8 py-5">
                        <div className="flex flex-col items-center mt-8">
                            <div className="flex justify-center h-full mb-5">
                                <Image
                                    src="/Register Icon.svg"
                                    width={60}
                                    height={60}
                                    alt="Register Icon"
                                />
                            </div>
                            <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary mb-0">
                                Register
                            </h1>
                            <p className="lg:text-small mb:text-small sm:text-small text-small text-fontcolor mb-0">
                                as
                            </p>
                        </div>

                        <div className="flex flex-col items-center mt-5 mb-5 space-y-4">
                            {/* PAGPINILI ITO YUNG SA REG FORM AY CompanyInfo */}
                            <button
                                className="button1 h-[40px] flex items-center px-6 py-3"
                                onClick={() => setRole("company")}
                            >
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src="/Company Icon.svg"
                                        width={19}
                                        height={10}
                                        alt="Company Icon"
                                    />
                                    <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall font-medium text-center">
                                        Company
                                    </p>
                                </div>
                            </button>

                            {/* PAGPINILI ITO YUNG SA REG FORM AY PersonalInfo */}
                            <button
                                id="applicant"
                                className="button1 flex items-center px-6 py-3"
                                onClick={() => setRole("applicant")}
                            >
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src="/Applicant Icon.svg"
                                        width={19}
                                        height={10}
                                        alt="Applicant Icon"
                                    />
                                    <p className="lg:text-medium mb:text-medium sm:text-xxsmall xsm:text-xxsmall font-medium text-center">
                                        Applicant
                                    </p>
                                </div>
                            </button>

                            <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                Already have an account?{" "}
                                <span className="font-semibold">
                                    <Link
                                        href="/GENERAL/Login"
                                        className="underline"
                                    >
                                        Sign in
                                    </Link>
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Steps 1-3 */}
                {step > 0 && (
                    <div className="job-application-box rounded-xs px-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="lg:text-extralarge mb:text-large sm:text-large text-primary">
                                Register
                            </h1>
                            {step === 3 && (
                                <button
                                    onClick={handleNextStep}
                                    className="text-primary font-medium lg:text-medium mb:text-medium sm:text-xxsmall"
                                >
                                    Skip
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center pb-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div
                                    className={`relative h-1 rounded-full transition-all duration-300 ${
                                        step === 1
                                            ? "w-1/3"
                                            : step === 2
                                            ? "w-2/3"
                                            : "w-full"
                                    } bg-primary`}
                                ></div>
                            </div>
                        </div>
                        <p className="font-medium lg:text-medium mb:text-medium sm:text-medium pb-7 text-fontcolor">
                            {step === 1
                                ? "Register Email Address"
                                : step === 2
                                ? "Confirm Password"
                                : ""}
                        </p>

                        {/* Step 1: Register Email */}
                        {step === 1 && (
                            <form onSubmit={getEmail}>
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                                    Email Address
                                </p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        placeholder="applicant@gmail.com"
                                        onChange={handleEmailChange}
                                        required
                                    ></input>
                                </div>

                                {/*checkbox*/}
                                <div className="flex pt-8 pb-1">
                                    <input
                                        type="checkbox"
                                        value=""
                                        id="agreement"
                                        className="flex items-start h-5 w-8 "
                                        onChange={handleCheckboxChange}
                                    />
                                    <p className="text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall items-center justify-center ml-4">
                                        {" "}
                                        By creating an account or signing in,
                                        you understand and agree to our Terms.
                                        By using our platform, you acknowledge
                                        that you have read, understood, and
                                        agree to our{" "}
                                        <span className="font-medium">
                                            {" "}
                                            <Link href="" className="underline">
                                                Terms & Condition
                                            </Link>
                                        </span>{" "}
                                        and{" "}
                                        <span className="font-medium">
                                            {" "}
                                            <Link href="" className="underline">
                                                Privacy Policy
                                            </Link>
                                        </span>{" "}
                                        that outlines how we collect, use, and
                                        protect your personal information.
                                    </p>
                                </div>

                                <div className="flex justify-between mt-12">
                                    <button
                                        type="button"
                                        className="button2 flex items-center justify-center"
                                        onClick={handlePreviousStep}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src="/Arrow Left.svg"
                                                width={23}
                                                height={10}
                                                alt="Back Icon"
                                            />
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                Back
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="button1 flex items-center justify-center"
                                        onClick={getEmail}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                Continue
                                            </p>
                                            <Image
                                                src="/Arrow Right.svg"
                                                width={23}
                                                height={10}
                                                alt="Continue Icon"
                                            />
                                        </div>
                                    </button>
                                </div>
                                <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                    Already have an account?{" "}
                                    <span className="font-semibold">
                                        <Link
                                            href="/GENERAL/Login"
                                            className="underline"
                                        >
                                            Sign in
                                        </Link>
                                    </span>
                                </p>
                            </form>
                        )}

                        {/* Step 2: Confirm Password */}
                        {step === 2 && (
                            <form>
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                                    Password
                                </p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password"
                                        onChange={handlePassword}
                                    />
                                </div>

                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pt-4 pb-1 text-fontcolor font-medium">
                                    Confirm Password
                                </p>
                                <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="confirm-password"
                                        name="confirmPassword"
                                        onChange={handleConfirmPassword}
                                    />
                                </div>

                                <div className="flex justify-between mt-12">
                                    <button
                                        type="button"
                                        className="button2 flex items-center justify-center"
                                        onClick={handlePreviousStep}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src="/Arrow Left.svg"
                                                width={23}
                                                height={10}
                                                alt="Back Icon"
                                            />
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                Back
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="button1 flex items-center justify-center"
                                        onClick={getPassword}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                Continue
                                            </p>
                                            <Image
                                                src="/Arrow Right.svg"
                                                width={23}
                                                height={10}
                                                alt="Continue Icon"
                                            />
                                        </div>
                                    </button>
                                </div>

                                <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                    Already have an account?{" "}
                                    <span className="font-semibold">
                                        <Link
                                            href="/GENERAL/Login"
                                            className="underline"
                                        >
                                            Sign in
                                        </Link>
                                    </span>
                                </p>
                            </form>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div>
                                {!showPersonalInfo && !showCompanyInfo ? (
                                    <div>
                                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 font-medium">
                                            Would you like to fill out your
                                            information forms?
                                        </p>
                                        {/* Display only one button based on the current state */}
                                        {isApplicant ? (
                                            <div className="flex justify-end">
                                                <button
                                                    className="button1 mt-7 flex items-center justify-center"
                                                    onClick={
                                                        handleShowPersonalInfo
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                            Yes
                                                        </p>
                                                        <Image
                                                            src="/Arrow Right.svg"
                                                            width={23}
                                                            height={10}
                                                            alt="Arrow Icon"
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        ) : isCompany ? (
                                            <div className="flex justify-end">
                                                <button
                                                    className="button1 mt-7 flex items-center justify-center"
                                                    onClick={() =>
                                                        setShowCompanyInfo(true)
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                            Yes
                                                        </p>
                                                        <Image
                                                            src="/Arrow Right.svg"
                                                            width={23}
                                                            height={10}
                                                            alt="Arrow Icon"
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-red-500">
                                                No valid role detected. Please
                                                choose a role.
                                            </p>
                                        )}
                                    </div>
                                ) : showPersonalInfo ? (
                                    // Display the PersonalInfo component
                                    <PersonalInfo isEditable={!isEditable} />
                                ) : (
                                    // Display the CompanyInfo component
                                    <CompanyInfo isEditable={!isEditable} />
                                )}

                                <p className="text-xsmall text-fontcolor pt-4 pb-1 font-medium">
                                    {" "}
                                    Already have an account?{" "}
                                    <span className="font-semibold">
                                        <Link
                                            href="/GENERAL/Login"
                                            className="underline"
                                        >
                                            Sign in
                                        </Link>
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ToastWrapper />
            <GeneralFooter />
        </div>
    );
}
