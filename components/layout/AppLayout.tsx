"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Tutup sidebar otomatis setiap kali pindah halaman
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Kunci scroll halaman saat sidebar sedang terbuka (UX Mobile-first)
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Daftar Menu Navigasi
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Data Anak", href: "/child", icon: "👶" },
    { name: "Edukasi Gizi", href: "/education", icon: "📚" },
  ];

  return (
    <div className='min-h-screen bg-[#FDFBF7] font-sans text-black selection:bg-yellow-300 selection:text-black'>
      {/* =========================================
          HEADER / NAVBAR (TETAP ADA)
          ========================================= */}
      <header className='border-b-4 border-black bg-white py-4 px-4 sm:px-6 sticky top-0 z-40 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {/* Tombol Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 border-2 border-black bg-yellow-300 shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all'
            aria-label='Buka Menu'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='square'
                strokeLinejoin='miter'
                strokeWidth={3}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>

          <Link
            href='/dashboard'
            className='text-xl sm:text-2xl font-black uppercase tracking-widest bg-yellow-300 px-2 border-2 border-black shadow-[2px_2px_0_0_#000]'
          >
            Stunt<span className='text-blue-600'>Check</span>
          </Link>
        </div>

        {/* Profil Mini di Pojok Kanan */}
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 bg-blue-300 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center font-black text-lg'>
            👤
          </div>
        </div>
      </header>

      {/* =========================================
          BACKDROP OVERLAY (MENGGELAPKAN LAYAR)
          ========================================= */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity cursor-pointer'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* =========================================
          SIDEBAR DRAWER
          ========================================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r-4 border-black shadow-[8px_0_0_0_#000] z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Sidebar (Tombol Tutup) */}
        <div className='h-[76px] border-b-4 border-black flex items-center justify-between px-4 bg-yellow-300'>
          <span className='font-black text-xl uppercase'>Navigasi</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='w-8 h-8 flex items-center justify-center border-2 border-black bg-red-400 hover:bg-red-500 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-black text-white'
          >
            X
          </button>
        </div>

        {/* Menu Links */}
        <nav className='flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]'>
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 border-2 border-black font-black uppercase text-sm transition-all shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                  isActive
                    ? "bg-blue-400 text-white translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0_0_#000]"
                    : "bg-white hover:bg-yellow-200"
                }`}
              >
                <span className='text-xl'>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className='p-4 border-t-4 border-black bg-white'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-black bg-gray-200 hover:bg-red-400 hover:text-white font-black uppercase text-sm transition-all shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
          >
            <span>🚪</span> Keluar Akun
          </button>
        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT WRAPPER
          ========================================= */}
      <main className='max-w-6xl mx-auto p-4 sm:p-6 md:p-10 transition-all duration-300'>
        {children}
      </main>
    </div>
  );
};
