"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 🟢 1. Import your Supabase client (adjust path if needed)
import { supabase } from "../../lib/supabaseClient"; 

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 2. The Real Logout Logic
  const handleLogout = async () => {
    try {
      // Tell Supabase to destroy the session on the backend
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Supabase logout error:", error.message);
        return;
      }

      // Clear any local state
      localStorage.removeItem("active_project"); 
      
      // Close the dropdown
      setIsOpen(false);
      
      // Force Next.js to clear its router cache and send them to login
      router.push("/login");
      router.refresh(); 
      
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-green-900 border border-white/10 overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(34,197,94,0.2)]"
      >
        AM
      </div>

      {isOpen && (
        <div className="absolute right-0 top-12 w-40 bg-[#111111] border border-white/10 rounded-xl shadow-xl py-1 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full flex items-center gap-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Settings
          </Link>

          <div className="h-[1px] bg-white/5 mx-2 my-0.5" />

          <button 
            onClick={handleLogout}
            className="px-4 py-2.5 text-left text-[11px] font-bold text-red-500 hover:bg-red-500/10 transition-colors w-full flex items-center gap-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}