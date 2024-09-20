import React from "react";
import UploadData from "@/components/Admin";
import { Header } from "@/components/Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Admin = () => {
  return (
    <>
      <Header />
      <UploadData />
      <ToastContainer/>
    </>
  );
};

export default Admin;
