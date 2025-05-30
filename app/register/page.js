"use client";
// pages/register.js
import { useState } from "react";
import RegisterModal from "../Components/registermodal";

const RegisterPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>{showModal && <RegisterModal onClose={() => setShowModal(false)} />}</>
  );
};

export default RegisterPage;
