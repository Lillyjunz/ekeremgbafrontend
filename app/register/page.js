"use client";
// pages/register.js
import { useState } from "react";
import RegisterModal from "../Components/registermodal";

const RegisterPage = () => {
  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return <div>{showModal && <RegisterModal onClose={handleCloseModal} />}</div>;
};

export default RegisterPage;
