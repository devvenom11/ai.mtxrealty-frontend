import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../lib/firebase"; // Path to your firebase.js
const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data?.email, data?.password);
      const user = userCredential.user;
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true,
      };

      await updateProfile(user, {
        displayName: data?.name,
      });

      await sendEmailVerification(user, actionCodeSettings);

      toast.success("Verification email sent! Check your inbox.");
      setLoading(false);
      window.location.href = "/auth/verify";
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
        <div className="xl:px-20 md:px-10 sm:px-6 px-4 md:py-12 py-9 2xl:mx-auto 2xl:container md:flex items-center justify-center">
          <div className="md:hidden sm:mb-8 mb-6">
            <svg width={191} height={34} viewBox="0 0 191 34" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="bg-white shadow-lg rounded xl:w-1/3 lg:w-5/12 md:w-1/2 w-full lg:px-10 sm:px-6 sm:py-10 px-2 py-6">
            <p tabIndex={0} className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">
              Create an account
            </p>
            <p tabIndex={0} className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="hover:text-indigo-500 focus:text-indigo-500 focus:outline-none focus:underline hover:underline text-sm font-semibold leading-none text-indigo-700 cursor-pointer"
              >
                Login here
              </Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6">
                <label htmlFor="name" className="text-sm font-medium leading-none text-gray-800">
                  Full Name
                </label>
                <input
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  type="text"
                  className="bg-gray-100 border rounded text-xs font-medium leading-none placeholder-gray-400 text-gray-900 py-3 w-full pl-3 mt-2"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              {/* Email Field */}
              <div className="mt-6">
                <label htmlFor="email" className="text-sm font-medium leading-none text-gray-800">
                  Email
                </label>
                <input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  type="email"
                  className="bg-gray-100 border rounded text-xs font-medium leading-none placeholder-gray-400 text-gray-900 py-3 w-full pl-3 mt-2"
                  placeholder="e.g., john@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="mt-6">
                <label htmlFor="password" className="text-sm font-medium leading-none text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                        message: "Password must be at least 6 characters long and contain both letters and numbers",
                      },
                    })}
                    type={showPass ? "text" : "password"}
                    className="bg-gray-100 border rounded text-xs font-medium leading-none text-gray-900 py-3 w-full pl-3 mt-2"
                    placeholder="Password"
                  />
                  <div onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 cursor-pointer mt-2 z-50">
                    {showPass ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825a10.05 10.05 0 001.38-.947m-3.504.947C6.477 18.225 3.657 14.48 2.534 12.352a2.394 2.394 0 010-2.704C3.657 7.52 6.477 3.775 12 3.775c3.522 0 6.254 2.022 7.843 4.09m-2.634 3.978C17.152 12.864 14.855 10.8 12 10.8c-1.61 0-2.923.773-3.95 1.993M15 12.857c-.5-.73-1.5-1.857-3-1.857-1.5 0-2.5 1.127-3 1.857M10 12.857l2 2m0-2l-2 2"
                        />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 15.232a9 9 0 01-12.023-12.023m12.023 12.023A9 9 0 0112 12m-3.394-3.394A9 9 0 0115.232 2.768m0 12.464a9 9 0 001.768 2.304M21 12a9 9 0 00-9-9"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>

          <div className="xl:w-1/3 md:w-1/2 lg:ml-16 ml-8 md:mt-0 mt-6">
            <div className=" md:block hidden">
              
              <div className="w-[191px] h-[85px]">
                <img src="/images/logo.png" alt="Logo picture" className="w-full h-full center bg-cover" />
              </div>
            </div>
            <div className="flex items-start mt-8">
              <div>
                <svg width={22} height={14} viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.0666 6.65142C15.7914 6.17428 16.6517 5.94576 17.5177 6.00035C18.3837 6.05493 19.2085 6.38965 19.8677 6.95402C20.5268 7.51839 20.9845 8.28179 21.1718 9.12907C21.3591 9.97636 21.2658 10.8616 20.906 11.6512C20.5461 12.4408 19.9393 13.092 19.177 13.5065C18.4146 13.921 17.5382 14.0764 16.6798 13.9492C15.8215 13.822 15.0277 13.4192 14.4184 12.8014C13.809 12.1836 13.4171 11.3844 13.3016 10.5244C12.9366 8.73142 12.7946 6.57642 13.5086 4.62542C14.2746 2.53542 15.9726 0.821417 19.0136 0.0254175C19.2671 -0.0328119 19.5332 0.00995174 19.7556 0.144642C19.978 0.279332 20.1392 0.495356 20.205 0.746904C20.2708 0.998453 20.2361 1.26575 20.1081 1.4921C19.9802 1.71846 19.7691 1.88608 19.5196 1.95942C17.0596 2.60342 15.9096 3.88942 15.3866 5.31342C15.2316 5.73842 15.1266 6.18742 15.0666 6.65142Z"
                    fill="#4B5563"
                  />
                  <path
                    d="M2.06664 6.65142C2.79142 6.17428 3.65171 5.94576 4.51773 6.00035C5.38375 6.05493 6.20853 6.38965 6.86766 6.95402C7.5268 7.51839 7.98454 8.28179 8.17183 9.12907C8.35912 9.97636 8.26581 10.8616 7.90597 11.6512C7.54612 12.4408 6.93927 13.092 6.17695 13.5065C5.41463 13.921 4.53818 14.0764 3.67982 13.9492C2.82145 13.822 2.02772 13.4192 1.41836 12.8014C0.808998 12.1836 0.417052 11.3844 0.301644 10.5244C-0.0633559 8.73142 -0.205356 6.57642 0.508644 4.62542C1.27464 2.53542 2.97264 0.821417 6.01364 0.0254175C6.26706 -0.0328119 6.53318 0.00995174 6.7556 0.144642C6.97801 0.279332 7.13921 0.495356 7.20502 0.746904C7.27084 0.998453 7.23609 1.26575 7.10814 1.4921C6.98019 1.71846 6.7691 1.88608 6.51964 1.95942C4.05964 2.60342 2.90964 3.88942 2.38664 5.31342C2.23164 5.73842 2.12664 6.18742 2.06664 6.65142Z"
                    fill="#4B5563"
                  />
                </svg>
              
              </div>
              <p className="sm:text-2xl text-xl leading-7 text-gray-600 pl-2.5">
                Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. The writer has no idea what topic the random paragraph
                will be about when it appears
              </p>
            </div>
            <div className="flex items-center pl-8 mt-10">
              <div className="w-8 h-8">
                <img src="https://i.ibb.co/xLtZCRT/Mask-Group.png" alt="profile picture" className="w-full h-full" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium leading-none text-gray-800">Anita Jane</p>
                <p className="text-sm font-medium leading-none text-gray-600 mt-1 cursor-pointer hover:underline">See profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
