import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarSecretary } from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function Secretary() {
  // Inicia fechado em mobile, aberto em desktop
  const [navAberta, setNavAberta] = useState(() => window.innerWidth >= 1024);

  // Ajusta o estado ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNavAberta(true);
      } else {
        setNavAberta(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-claro)' }}>
      <SidebarSecretary navAberta={navAberta} setNavAberta={setNavAberta} />

      <div className="flex flex-col flex-1 w-full lg:w-auto overflow-hidden">
        <Navbar navAberta={navAberta} setNavAberta={setNavAberta} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto" style={{ backgroundColor: 'var(--bg-claro)', color: 'var(--text-escuro)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

