"use client";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import OutsideClickHandler from "react-outside-click-handler";

export function Header() {
  const [userData, setUserData] = useState();
  const [showDropDown, setShowDropDown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Save dark mode preference
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Save light mode preference
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const getInitialCharacters = (sentence) => {
    const words = sentence.split(" ");
    const initials = words.map((word) => word.charAt(0)).join("");
    return initials;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#212121]">
      <div className="px-6 flex justify-between items-center">
        <div className="flex items-center py-4">
          <Link href="/">
            <div className="w-12 h-12">
              <img src="/images/logo.png" className="w-full h-full dark:invert" />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {userData && userData?.displayName ? (
            <div className="relative">
              <div
                onClick={() => setShowDropDown(true)}
                className="w-[37px] h-[37px] flex justify-center items-center bg-indigo-700 text-[#fff] p-4 rounded-full"
              >
                <p className="uppercase">{getInitialCharacters(userData?.displayName)}</p>
              </div>
              {showDropDown && (
                <OutsideClickHandler onOutsideClick={() => setShowDropDown(false)}>
                  <div className="p-4 w-[150px] bg-slate-50 dark:bg-[#2f2f2f] h-[100px] right-3 border dark:border-gray-700 absolute z-10">
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-[#212121] dark:bg-[#2f2f2f] text-white rounded-md hover:bg-[#2f2f2f] dark:hover:bg-gray-600 text-sm"
                    >
                      Sign out
                    </button>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <p className="px-6 py-2 border border-gray-100 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 shadow hover:bg-gray-50 dark:hover:bg-[#2f2f2f] text-sm">
                  Login
                </p>
              </Link>
              <Link href="/auth/register">
                <p className="px-6 py-2 bg-[#212121] dark:bg-[#2f2f2f] text-white rounded-md hover:bg-[#2f2f2f] dark:hover:bg-gray-600 text-sm">
                  Sign Up
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
