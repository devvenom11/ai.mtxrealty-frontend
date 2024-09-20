import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged, sendEmailVerification, reload } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verify = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user);
        if (user.emailVerified) {
          setIsUser(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, [2000]);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendVerificationEmail = async () => {
    setLoading(true);
    const user = auth.currentUser;
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/verify`,
      handleCodeInApp: true,
    };

    if (user) {
      try {
        await sendEmailVerification(user, actionCodeSettings);
        setEmailSent(true);
        toast.success("Verification email sent again! Check your inbox.");
      } catch (err) {
        console.error("Error sending verification email:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="container mx-auto mt-20 pb-40">
        <div style={{ maxWidth: "512px" }} className="mx-auto rounded-xl bg-white py-10 px-4 sm:px-12 ">
          <div className="mb-7 w-full text-center">
            <svg width="84" className="mx-auto" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42 0.75C33.8415 0.75 25.8663 3.16927 19.0827 7.70188C12.2992 12.2345 7.01209 18.6769 3.88997 26.2143C0.76786 33.7518 -0.0490281 42.0458 1.54261 50.0475C3.13425 58.0492 7.06293 65.3992 12.8319 71.1682C18.6008 76.9371 25.9508 80.8657 33.9525 82.4574C41.9542 84.049 50.2482 83.2321 57.7857 80.11C65.3232 76.9879 71.7655 71.7008 76.2981 64.9173C80.8307 58.1337 83.25 50.1585 83.25 42C83.2405 31.0627 78.8915 20.5761 71.1577 12.8423C63.4239 5.10848 52.9373 0.759467 42 0.75V0.75ZM62.2125 29.2125L34.7125 56.7125C34.5883 56.8428 34.439 56.9465 34.2735 57.0174C34.1081 57.0883 33.93 57.1248 33.75 57.1248C33.57 57.1248 33.3919 57.0883 33.2265 57.0174C33.061 56.9465 32.9117 56.8428 32.7875 56.7125L21.7875 45.7125C21.5365 45.4564 21.3967 45.1115 21.3985 44.7528C21.4003 44.3942 21.5436 44.0508 21.7972 43.7972C22.0508 43.5436 22.3942 43.4003 22.7529 43.3985C23.1115 43.3967 23.4564 43.5365 23.7125 43.7875L33.75 53.825L60.2875 27.2875C60.4134 27.159 60.5636 27.0567 60.7293 26.9866C60.895 26.9165 61.0729 26.88 61.2529 26.879C61.4328 26.8781 61.6111 26.9129 61.7775 26.9813C61.9439 27.0498 62.0951 27.1505 62.2223 27.2777C62.3495 27.4049 62.4502 27.5561 62.5187 27.7225C62.5871 27.8889 62.6219 28.0672 62.621 28.2472C62.6201 28.4271 62.5835 28.605 62.5134 28.7707C62.4433 28.9364 62.341 29.0866 62.2125 29.2125V29.2125Z"
                fill="#3BB273"
              />
            </svg>
          </div>

          <div className="w-full flex flex-col items-center ">
            <p className="mb-3 text-center text-2xl font-bold leading-7 text-gray-700">{isUser ? "Your email has been  verified" : "Verify your email"} </p>
            {isUser ? null : (
              <>
                <p>{isUser ? "You can  sign in now" : "Please check your inbox and click on the verification link."}</p>

                {!emailSent && <p className="mt-2">If you didn&apos;t receive an email, you can resend it.</p>}
                <p>
                  Didn&apos;t recieve an email.
                  <span onClick={handleResendVerificationEmail} className="text-indigo-700 cursor-pointer underline ">
                    {loading ? "Resending..." : "Resend verification email"}
                  </span>{" "}
                </p>
                {emailSent && <p className="mt-2">A new verification email has been sent.</p>}
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Verify;
