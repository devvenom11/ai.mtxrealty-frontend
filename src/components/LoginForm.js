import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "./Common/Loader";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDocument, setDocument } from "@/utils/helpers";
// import { toas}
// import { useDispatch } from "react-redux";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showpass, setShowPass] = useState(false);
  const [showToast, setShowTaost] = useState(false);
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoading(false);
      const res = await getDocument("chat_history", userCredential?.user?.uid);
      if (!res) {
        const payload = {
          chatHistory: [],
        };
        setDocument("chat_history", userCredential?.user?.uid, payload);
      }
      router.push("/");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="md:px-10 sm:px-6 px-4 md:py-12 py-9 2xl:mx-auto 2xl:max-w-lg md:flex items-center justify-center">
          <div className="md:hidden sm:mb-8 mb-6">
            <svg
              width={191}
              height={34}
              viewBox="0 0 191 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M61.8409 17.2727C61.8409 11.75 58.6023 8.30682 54.1364 8.30682C49.6705 8.30682 46.4318 11.75 46.4318 17.2727C46.4318 22.7955 49.6705 26.2386 54.1364 26.2386C58.6023 26.2386 61.8409 22.7955 61.8409 17.2727ZM59.7955 17.2727C59.7955 21.8068 57.3068 24.2614 54.1364 24.2614C50.9659 24.2614 48.4773 21.8068 48.4773 17.2727C48.4773 12.7386 50.9659 10.2841 54.1364 10.2841C57.3068 10.2841 59.7955 12.7386 59.7955 17.2727ZM75.8267 12.9091H73.6449L70.0312 23.3409H69.8949L66.2812 12.9091H64.0994L68.9403 26H70.9858L75.8267 12.9091ZM83.331 26.2727C86.8764 26.2727 89.2628 23.5795 89.2628 19.5227C89.2628 15.4318 86.8764 12.7386 83.331 12.7386C79.7855 12.7386 77.3991 15.4318 77.3991 19.5227C77.3991 23.5795 79.7855 26.2727 83.331 26.2727ZM83.331 24.4659C80.6378 24.4659 79.4105 22.1477 79.4105 19.5227C79.4105 16.8977 80.6378 14.5455 83.331 14.5455C86.0241 14.5455 87.2514 16.8977 87.2514 19.5227C87.2514 22.1477 86.0241 24.4659 83.331 24.4659ZM94.3445 18.125C94.3445 15.8409 95.7592 14.5455 97.6854 14.5455C99.5518 14.5455 100.685 15.7642 100.685 17.8182V26H102.697V17.6818C102.697 14.3409 100.915 12.7386 98.2649 12.7386C96.2876 12.7386 95.0604 13.625 94.4467 14.9545H94.2763V12.9091H92.3331V26H94.3445V18.125ZM106.645 26H108.759V19.1818H112.577C112.73 19.1818 112.875 19.1818 113.02 19.1733L116.702 26H119.156L115.21 18.7898C117.435 18.0312 118.474 16.2159 118.474 13.8977C118.474 10.8125 116.634 8.54545 112.543 8.54545H106.645V26ZM108.759 17.2727V10.4205H112.474C115.304 10.4205 116.395 11.8011 116.395 13.8977C116.395 15.9943 115.304 17.2727 112.509 17.2727H108.759ZM129.974 20.6477C129.974 23.1023 128.099 24.2273 126.599 24.2273C124.928 24.2273 123.735 23 123.735 21.0909V12.9091H121.724V21.2273C121.724 24.5682 123.496 26.1705 125.951 26.1705C127.928 26.1705 129.224 25.1136 129.837 23.7841H129.974V26H131.985V12.9091H129.974V20.6477ZM141.158 26.2727C143.817 26.2727 145.76 24.9432 146.374 22.9659L144.43 22.4205C143.919 23.7841 142.734 24.4659 141.158 24.4659C138.797 24.4659 137.169 22.9403 137.075 20.1364H146.578V19.2841C146.578 14.4091 143.68 12.7386 140.953 12.7386C137.408 12.7386 135.055 15.5341 135.055 19.5568C135.055 23.5795 137.374 26.2727 141.158 26.2727ZM137.075 18.3977C137.212 16.3608 138.652 14.5455 140.953 14.5455C143.135 14.5455 144.533 16.1818 144.533 18.3977H137.075ZM154.581 26.2727C157.104 26.2727 157.956 24.7045 158.399 23.9886H158.638V26H160.581V8.54545H158.57V14.9886H158.399C157.956 14.3068 157.172 12.7386 154.615 12.7386C151.308 12.7386 149.024 15.3636 149.024 19.4886C149.024 23.6477 151.308 26.2727 154.581 26.2727ZM154.854 24.4659C152.331 24.4659 151.036 22.25 151.036 19.4545C151.036 16.6932 152.297 14.5455 154.854 14.5455C157.308 14.5455 158.604 16.5227 158.604 19.4545C158.604 22.4205 157.274 24.4659 154.854 24.4659ZM170.033 26.2727C172.692 26.2727 174.635 24.9432 175.249 22.9659L173.305 22.4205C172.794 23.7841 171.609 24.4659 170.033 24.4659C167.672 24.4659 166.044 22.9403 165.95 20.1364H175.453V19.2841C175.453 14.4091 172.555 12.7386 169.828 12.7386C166.283 12.7386 163.93 15.5341 163.93 19.5568C163.93 23.5795 166.249 26.2727 170.033 26.2727ZM165.95 18.3977C166.087 16.3608 167.527 14.5455 169.828 14.5455C172.01 14.5455 173.408 16.1818 173.408 18.3977H165.95ZM180.524 18.125C180.524 15.8409 181.939 14.5455 183.865 14.5455C185.732 14.5455 186.865 15.7642 186.865 17.8182V26H188.876V17.6818C188.876 14.3409 187.095 12.7386 184.445 12.7386C182.467 12.7386 181.24 13.625 180.626 14.9545H180.456V12.9091H178.513V26H180.524V18.125Z"
                fill="#1F2937"
              />
              <path
                d="M1 17H0H1ZM7 17H6H7ZM17 27V28V27ZM27 17H28H27ZM17 0C12.4913 0 8.1673 1.79107 4.97918 4.97918L6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2V0ZM4.97918 4.97918C1.79107 8.1673 0 12.4913 0 17H2C2 13.0218 3.58035 9.20644 6.3934 6.3934L4.97918 4.97918ZM0 17C0 21.5087 1.79107 25.8327 4.97918 29.0208L6.3934 27.6066C3.58035 24.7936 2 20.9782 2 17H0ZM4.97918 29.0208C8.1673 32.2089 12.4913 34 17 34V32C13.0218 32 9.20644 30.4196 6.3934 27.6066L4.97918 29.0208ZM17 34C21.5087 34 25.8327 32.2089 29.0208 29.0208L27.6066 27.6066C24.7936 30.4196 20.9782 32 17 32V34ZM29.0208 29.0208C32.2089 25.8327 34 21.5087 34 17H32C32 20.9782 30.4196 24.7936 27.6066 27.6066L29.0208 29.0208ZM34 17C34 12.4913 32.2089 8.1673 29.0208 4.97918L27.6066 6.3934C30.4196 9.20644 32 13.0218 32 17H34ZM29.0208 4.97918C25.8327 1.79107 21.5087 0 17 0V2C20.9782 2 24.7936 3.58035 27.6066 6.3934L29.0208 4.97918ZM17 6C14.0826 6 11.2847 7.15893 9.22183 9.22183L10.636 10.636C12.3239 8.94821 14.6131 8 17 8V6ZM9.22183 9.22183C7.15893 11.2847 6 14.0826 6 17H8C8 14.6131 8.94821 12.3239 10.636 10.636L9.22183 9.22183ZM6 17C6 19.9174 7.15893 22.7153 9.22183 24.7782L10.636 23.364C8.94821 21.6761 8 19.3869 8 17H6ZM9.22183 24.7782C11.2847 26.8411 14.0826 28 17 28V26C14.6131 26 12.3239 25.0518 10.636 23.364L9.22183 24.7782ZM17 28C19.9174 28 22.7153 26.8411 24.7782 24.7782L23.364 23.364C21.6761 25.0518 19.3869 26 17 26V28ZM24.7782 24.7782C26.8411 22.7153 28 19.9174 28 17H26C26 19.3869 25.0518 21.6761 23.364 23.364L24.7782 24.7782ZM28 17C28 14.0826 26.8411 11.2847 24.7782 9.22183L23.364 10.636C25.0518 12.3239 26 14.6131 26 17H28ZM24.7782 9.22183C22.7153 7.15893 19.9174 6 17 6V8C19.3869 8 21.6761 8.94821 23.364 10.636L24.7782 9.22183ZM10.3753 8.21913C6.86634 11.0263 4.86605 14.4281 4.50411 18.4095C4.14549 22.3543 5.40799 26.7295 8.13176 31.4961L9.86824 30.5039C7.25868 25.9371 6.18785 21.9791 6.49589 18.5905C6.80061 15.2386 8.46699 12.307 11.6247 9.78087L10.3753 8.21913ZM23.6247 25.7809C27.1294 22.9771 29.1332 19.6127 29.4958 15.6632C29.8549 11.7516 28.5904 7.41119 25.8682 2.64741L24.1318 3.63969C26.7429 8.20923 27.8117 12.1304 27.5042 15.4803C27.2001 18.7924 25.5372 21.6896 22.3753 24.2191L23.6247 25.7809Z"
                fill="#1F2937"
              />
            </svg>
          </div>
          <div className="bg-white shadow-lg rounded md:w-1/2 lg:w-full w-full lg:px-10 sm:px-6 sm:py-10 px-2 py-6">
            <p
              tabIndex={0}
              className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800"
            >
              Login to your account
            </p>
            <p
              tabIndex={0}
              className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500"
            >
              Dont have account?{" "}
              <Link
                href={"/auth/register"}
                className="hover:text-indigo-500 font-semibold focus:text-indigo-500 focus:outline-none focus:underline hover:underline text-sm leading-none text-indigo-700 cursor-pointer"
              >
                {" "}
                Sign up here
              </Link>
            </p>

            <div className="mt-10">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none text-gray-800"
              >
                {" "}
                Email{" "}
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                aria-labelledby="email"
                type="email"
                className="bg-gray-100 border rounded text-xs font-medium leading-none placeholder-gray-400 text-gray-900 py-3 w-full pl-3 mt-2"
                placeholder="e.g: john@gmail.com "
              />
            </div>
            <div className="mt-6 w-full">
              <label
                htmlFor="myInput"
                className="text-sm font-medium leading-none text-gray-800"
              >
                {" "}
                Password{" "}
              </label>
              <div className="relative flex items-center justify-center">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="myInput"
                  type={showpass ? "text" : "password"}
                  className="bg-gray-100 border rounded text-xs font-medium leading-none text-gray-900 py-3 w-full pl-3 mt-2"
                />
                <div
                  onClick={() => setShowPass(!showpass)}
                  className="absolute right-0 mt-2 mr-3 cursor-pointer"
                >
                  <div id="show">
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.99978 2C11.5944 2 14.5851 4.58667 15.2124 8C14.5858 11.4133 11.5944 14 7.99978 14C4.40511 14 1.41444 11.4133 0.787109 8C1.41378 4.58667 4.40511 2 7.99978 2ZM7.99978 12.6667C9.35942 12.6664 10.6787 12.2045 11.7417 11.3568C12.8047 10.509 13.5484 9.32552 13.8511 8C13.5473 6.67554 12.8031 5.49334 11.7402 4.64668C10.6773 3.80003 9.35864 3.33902 7.99978 3.33902C6.64091 3.33902 5.32224 3.80003 4.25936 4.64668C3.19648 5.49334 2.45229 6.67554 2.14844 8C2.45117 9.32552 3.19489 10.509 4.25787 11.3568C5.32085 12.2045 6.64013 12.6664 7.99978 12.6667ZM7.99978 11C7.20413 11 6.44106 10.6839 5.87846 10.1213C5.31585 9.55871 4.99978 8.79565 4.99978 8C4.99978 7.20435 5.31585 6.44129 5.87846 5.87868C6.44106 5.31607 7.20413 5 7.99978 5C8.79543 5 9.55849 5.31607 10.1211 5.87868C10.6837 6.44129 10.9998 7.20435 10.9998 8C10.9998 8.79565 10.6837 9.55871 10.1211 10.1213C9.55849 10.6839 8.79543 11 7.99978 11ZM7.99978 9.66667C8.4418 9.66667 8.86573 9.49107 9.17829 9.17851C9.49085 8.86595 9.66644 8.44203 9.66644 8C9.66644 7.55797 9.49085 7.13405 9.17829 6.82149C8.86573 6.50893 8.4418 6.33333 7.99978 6.33333C7.55775 6.33333 7.13383 6.50893 6.82126 6.82149C6.5087 7.13405 6.33311 7.55797 6.33311 8C6.33311 8.44203 6.5087 8.86595 6.82126 9.17851C7.13383 9.49107 7.55775 9.66667 7.99978 9.66667Z"
                        fill="#71717A"
                      />
                    </svg>
                  </div>
                  <div id="hide" className="hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-eye-off"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#27272A"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1={3} y1={3} x2={21} y2={21} />
                      <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                      <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* <p tabIndex={0} className="focus:outline-none text-end w-full text-sm font-medium leading-none text-gray-500 mt-4 mb-8">
              <Link
                href={"/auth/reset-password"}
                className="hover:text-indigo-500 text-end focus:text-indigo-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none text-indigo-700 cursor-pointer"
              >
                Forgot password?
              </Link>
            </p> */}
            <div className="mt-8">
              <button
                onClick={handleLogin}
                type="button"
                className={`focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full ${
                  loading && "py-[2px]"
                } `}
              >
                {loading ? <Loader centered noMargin /> : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const SocialLogin = () => {
  return (
    <>
      <button
        aria-label="Continue with google"
        role="button"
        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 p-3 border rounded-lg border-gray-700 flex items-center w-full mt-10 hover:bg-gray-100"
      >
        <svg
          width={19}
          height={20}
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z"
            fill="#4285F4"
          />
          <path
            d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z"
            fill="#34A853"
          />
          <path
            d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z"
            fill="#FBBC05"
          />
          <path
            d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z"
            fill="#EB4335"
          />
        </svg>
        <p className="text-base font-medium ml-4 text-gray-700">
          Continue with Google
        </p>
      </button>
      <button
        aria-label="Continue with github"
        role="button"
        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 p-3 border rounded-lg border-gray-700 flex items-center w-full mt-4 hover:bg-gray-100"
      >
        <svg
          width={21}
          height={20}
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1543 0C4.6293 0 0.154298 4.475 0.154298 10C0.153164 12.0993 0.813112 14.1456 2.04051 15.8487C3.26792 17.5517 5.00044 18.8251 6.9923 19.488C7.4923 19.575 7.6793 19.275 7.6793 19.012C7.6793 18.775 7.6663 17.988 7.6663 17.15C5.1543 17.613 4.5043 16.538 4.3043 15.975C4.1913 15.687 3.7043 14.8 3.2793 14.562C2.9293 14.375 2.4293 13.912 3.2663 13.9C4.0543 13.887 4.6163 14.625 4.8043 14.925C5.7043 16.437 7.1423 16.012 7.7163 15.75C7.8043 15.1 8.0663 14.663 8.3543 14.413C6.1293 14.163 3.8043 13.3 3.8043 9.475C3.8043 8.387 4.1913 7.488 4.8293 6.787C4.7293 6.537 4.3793 5.512 4.9293 4.137C4.9293 4.137 5.7663 3.875 7.6793 5.163C8.49336 4.93706 9.33447 4.82334 10.1793 4.825C11.0293 4.825 11.8793 4.937 12.6793 5.162C14.5913 3.862 15.4293 4.138 15.4293 4.138C15.9793 5.513 15.6293 6.538 15.5293 6.788C16.1663 7.488 16.5543 8.375 16.5543 9.475C16.5543 13.313 14.2173 14.163 11.9923 14.413C12.3543 14.725 12.6673 15.325 12.6673 16.263C12.6673 17.6 12.6543 18.675 12.6543 19.013C12.6543 19.275 12.8423 19.587 13.3423 19.487C15.3273 18.8168 17.0522 17.541 18.2742 15.8392C19.4962 14.1373 20.1537 12.0951 20.1543 10C20.1543 4.475 15.6793 0 10.1543 0Z"
            fill="#333333"
          />
        </svg>
        <p className="text-base font-medium ml-4 text-gray-700">
          Continue with Github
        </p>
      </button>
      <button
        aria-label="Continue with twitter"
        role="button"
        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 p-3 border rounded-lg border-gray-700 flex items-center w-full mt-4 hover:bg-gray-100"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.1623 5.656C21.3989 5.9937 20.5893 6.21548 19.7603 6.314C20.634 5.79144 21.288 4.96902 21.6003 4C20.7803 4.488 19.8813 4.83 18.9443 5.015C18.3149 4.34158 17.4807 3.89497 16.5713 3.74459C15.6618 3.59421 14.7282 3.74849 13.9156 4.18346C13.1029 4.61842 12.4567 5.30969 12.0774 6.1498C11.6981 6.9899 11.607 7.93178 11.8183 8.829C10.1554 8.74566 8.52863 8.31353 7.04358 7.56067C5.55854 6.80781 4.24842 5.75105 3.1983 4.459C2.82659 5.09745 2.63125 5.82323 2.6323 6.562C2.6323 8.012 3.3703 9.293 4.4923 10.043C3.82831 10.0221 3.17893 9.84278 2.5983 9.52V9.572C2.5985 10.5377 2.93267 11.4736 3.54414 12.2211C4.15562 12.9685 5.00678 13.4815 5.9533 13.673C5.33691 13.84 4.6906 13.8647 4.0633 13.745C4.33016 14.5762 4.8503 15.3032 5.55089 15.8241C6.25147 16.345 7.09742 16.6338 7.9703 16.65C7.10278 17.3313 6.10947 17.835 5.04718 18.1322C3.98488 18.4294 2.87442 18.5143 1.7793 18.382C3.69099 19.6114 5.91639 20.2641 8.1893 20.262C15.8823 20.262 20.0893 13.889 20.0893 8.362C20.0893 8.182 20.0843 8 20.0763 7.822C20.8952 7.23017 21.6019 6.49702 22.1633 5.657L22.1623 5.656Z"
            fill="#1DA1F2"
          />
        </svg>
        <p className="text-base font-medium ml-4 text-gray-700">
          Continue with Twitter
        </p>
      </button>
      <div className="w-full flex items-center justify-between py-5">
        <hr className="w-full bg-gray-400" />
        <p className="text-base font-medium leading-4 px-2.5 text-gray-500">
          OR
        </p>
        <hr className="w-full bg-gray-400" />
      </div>
    </>
  );
};
