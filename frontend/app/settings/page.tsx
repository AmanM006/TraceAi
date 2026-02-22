"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "../components/ProfileDropDown"; 

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [profile, setProfile] = useState({
    name: "Aman Mishra",
    email: "amanm06.work@gmail.com",
  });

  const projectId = typeof window !== 'undefined' ? localStorage.getItem("active_project") : "";

  const handleSave = () => {
    setIsSaving(true);
    // Fake network delay for the UI
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans p-5 flex flex-col">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6 pl-2">
          <Link href={projectId ? `/errors?project=${projectId}` : "/errors"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg italic">T</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">TraceAI</span>
          </Link>
          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
            <Link href={projectId ? `/errors?project=${projectId}` : "/errors"} className="hover:text-white transition-colors">Dashboard</Link>
            <Link href={projectId ? `/my-errors?project=${projectId}` : "/my-errors"} className="hover:text-white transition-colors">My Errors</Link>
          </nav>
        </div>
        <ProfileDropdown />
      </header>

      {/* SETTINGS LAYOUT */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 px-3">Settings</h2>
          
          <button className="px-4 py-3 rounded-xl text-left text-sm font-bold transition-all flex items-center gap-3 bg-white/10 text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Profile
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 bg-[#111111] rounded-[28px] border border-white/5 p-8 lg:p-12 h-fit flex flex-col justify-between">
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Profile</h1>
            <p className="text-sm text-gray-500 mb-8">Manage your personal information.</p>
            
            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed focus:outline-none"
                  disabled
                />
                <p className="text-[10px] text-gray-600 mt-2 font-bold">Your email is tied to your authentication provider.</p>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
            {saved && <span className="text-sm font-bold text-green-400 animate-in fade-in">Changes saved!</span>}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${isSaving ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10'}`}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}