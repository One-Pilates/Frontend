import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarSecretary } from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";

export default function Secretary() {
  const [navAberta, setNavAberta] = useState(true);

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-claro)' }}>
      <SidebarSecretary navAberta={navAberta} userType="secretary" />

      <div className="flex flex-col flex-1">
        <Navbar navAberta={navAberta} setNavAberta={setNavAberta} />
        <main className="flex-1 p-6 overflow-auto" style={{ backgroundColor: 'var(--bg-claro)', color: 'var(--text-escuro)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

