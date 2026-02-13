import React from "react";

export default function ItemSidebar({ icon, texto, navAberta, ativo, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 cursor-pointer transition-all duration-200 rounded-full mx-2 my-1.5 md:my-2 ${
        ativo ? "bg-white dark:bg-dark-secondary text-orange-500 font-bold shadow-md" : "hover:bg-orange-600 active:bg-orange-700"
      }`}
    >
      {React.createElement(icon, { size: 20, className: "md:w-[22px] md:h-[22px]" })}
      {navAberta && <span className="text-sm md:text-base font-medium">{texto}</span>}
    </div>
  );
}


