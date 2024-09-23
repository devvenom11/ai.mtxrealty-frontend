"use client";
import { NextLogo } from "@/icons/Icons";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import OutsideClickHandler from "react-outside-click-handler";

export function Header() {
  const [userData, setUserData] = useState();
  const [showDropDown, setShowDropDown] = useState(false);

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
    <header className="border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <NextLogo />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {userData && userData?.displayName ? (
            <div className="relative">
              <div onClick={() => setShowDropDown(true)} className="w-[37px] h-[37px]  flex justify-center items-center bg-indigo-700 text-[#fff] p-4 rounded-full">
                <p className="uppercase">{getInitialCharacters(userData?.displayName)}</p>
              </div>
              {showDropDown && (
                <OutsideClickHandler onOutsideClick={() => setShowDropDown(false)}>
                  <div className="p-4 w-[150px] bg-slate-50 h-[100px] right-3 border  absolute z-10 ">
                    <button onClick={handleLogout} className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm">
                      Sign out
                    </button>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <p className="px-6 py-2 border border-gray-100 rounded-md text-gray-900 shadow hover:bg-gray-50 text-sm">Login</p>
              </Link>
              <Link href="/auth/register">
                <p className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm">Sign Up</p>
              </Link>{" "}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
