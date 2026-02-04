import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute left-0 flex items-center gap-2 px-4 py-2 bg-transparent  text-gray-600 dark:text-fontSec text-sm font-medium cursor-pointer transition-all duration-200 hover:text-black"
    >
      <FaArrowLeft className="text-sm" />
      <span>Voltar</span>
    </button>
  );
};

export default Back;
