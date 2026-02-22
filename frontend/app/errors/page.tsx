"use client";
import { useSearchParams } from "next/navigation";
import { TraceAI } from "@traceai/sdk";
import React, { useEffect, useState,use } from "react";
import LiveChart from "../components/LiveChart";
import CurrentTime from "../components/CurrentTime";
import ExportButton from "../components/ExportButton";
import ProfileDropdown from "../components/ProfileDropDown";
import ErrorFilters from "../components/ErrorFilters";
import Link from "next/link";

type ErrorRow = {
  id: string;
  message: string;
  count: number;
  environments: ("dev" | "prod")[];
  firstSeen: string;
  lastSeen: string;
};

export default function ErrorsDashboard() {
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "latest";
  const env = searchParams.get("env") ?? "";
  const projectId = typeof window !== 'undefined' ? localStorage.getItem("active_project") : "";


  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
  
    async function fetchErrors() {
      setLoading(true);
      
      // ✅ Get active project from localStorage
      const projectId = localStorage.getItem("active_project");
      
      if (!projectId) {
        console.warn("No active project selected");
        setErrors([]);
        setLoading(false);
        return;
      }
      
      const res = await fetch(`/api/errors?sort=${sort}&env=${env}&project=${projectId}`);
      const data = await res.json();
      
      if (!cancelled) {
        setErrors(data);
        setLoading(false);
      }
    }
  
    fetchErrors();
  
    return () => {
      cancelled = true;
    };
  }, [sort, env]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading errors…
      </div>
    );
  }

    
  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans p-5 flex flex-col overflow-hidden">
      
      {/* TOP HEADER */}
      <header className="flex items-center justify-between mb-6 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6 pl-2">
        <Link href="/projects" className="flex items-center gap-2 hover:opacity-80 transition">
  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
    <span className="text-black font-black text-lg italic">T</span>
  </div>
  <span className="text-lg font-bold tracking-tighter">TraceAi</span>
</Link>




          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
  <Link href={projectId ? `/errors?project=${projectId}` : "/errors"} className="text-white border-b-2 border-white pb-1 cursor-pointer">Dashboard</Link>
  <Link href={projectId ? `/my-errors?project=${projectId}` : "/my-errors"} className="hover:text-white cursor-pointer transition-colors">My Errors</Link>
  <Link href={projectId ? `/analytics?project=${projectId}` : "/analytics"} className="hover:text-white cursor-pointer transition-colors">Analytics</Link>
</nav>          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[12px] focus:outline-none focus:border-white/20"
            />
          </div>

          

          <div className="flex gap-2 mx-2">
            <HeaderIcon>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </HeaderIcon>
            <HeaderIcon>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </HeaderIcon>
          </div>

          <ProfileDropdown />
        </div>
      </header>

      {/* OVERVIEW SECTION */}
      <div className="mb-4 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter leading-none">Overview</h1>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-2 opacity-60">Runtime errors captured automatically</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <CurrentTime />
          <p className="text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] mt-1">System Time</p>
        </div>
      </div>

      {/* GRID SYSTEM */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 min-h-0">
        
        {/* Unique Errors Card */}
        <div className="col-span-3 row-span-3 bg-[#163020] rounded-[28px] p-6 flex flex-col justify-between border border-white/5 relative shadow-2xl">
          <div>
            <h3 className="text-[10px] font-black text-green-200/50 uppercase tracking-[0.2em] mb-4">Unique Errors</h3>
            <div className="text-green-400 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <p className="text-7xl font-black tracking-tighter text-white leading-none">
              {errors.length}
            </p>
          </div>
          <div className="bg-green-400/10 px-2 py-1.5 rounded-lg self-start">
            <p className="text-[9px] font-black text-green-400 uppercase tracking-widest leading-none italic">↑ Active Now</p>
          </div>
        </div>

        {/* Stats Bento (Sage Card) */}
        <div className="col-span-6 row-span-3 bg-[#D6E2D5] rounded-[28px] p-6 text-black flex items-center justify-around shadow-inner">
          <CompactStat 
            label="Total Occurrences" 
            val={errors.reduce((acc, curr) => acc + curr.count, 0).toString()} 
            trend="↑ Total Events" 
          />
          <div className="w-[1px] h-20 bg-black/5" />
          <CompactStat 
            label="Highest Frequency" 
            val={Math.max(0, ...errors.map(e => e.count)).toString()} 
            trend="↑ Single Error Peak" 
          />
        </div>

        {/* Live Feed */}
        <div className="col-span-3 row-span-3 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Active Error Feed</h3>
            <div className="w-8 h-4 bg-green-900/30 rounded-full flex items-center px-1">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full ml-auto shadow-[0_0_8px_#22c55e]" />
            </div>
          </div>
          <LiveChart errorData={errors} />
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span>Active Observers: 12</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Detailed Observations Table */}
        
        <div className="col-span-12 row-span-3 bg-[#111111] rounded-[28px] border border-white/5 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Detailed error observations</h2>
            <div className="flex items-center gap-2 mb-4">
  {/* Filter Group: Sort */}
  <div className="flex items-center bg-[#0A0A0A] border border-white/10 p-1 rounded-lg">
  <ErrorFilters totalErrors={errors.length} />  </div>
</div>

            {/* Export Button replacing View All */}
            <ExportButton data={errors} />
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 
             [&::-webkit-scrollbar]:w-1.5 
             [&::-webkit-scrollbar-track]:bg-transparent 
             [&::-webkit-scrollbar-thumb]:bg-[#333] 
             [&::-webkit-scrollbar-thumb]:rounded-full 
             hover:[&::-webkit-scrollbar-thumb]:bg-[#555]">            <table className="w-full text-left table-fixed">
              <thead className="sticky top-0 bg-[#111111] z-10 shadow-sm shadow-black/50">
                <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black border-b border-white/5">
                  <th className="px-4 py-4 w-1/2">Message</th>
                  <th className="px-4 py-4 text-center w-24">Count</th>
                  <th className="px-1 py-4 text-center w-24">Environment</th>
                  <th className="px-4 py-4 w-32">First Seen</th>
                  <th className="px-4 py-4 text-right w-32">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {errors.map(err => (
                  <tr key={err.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-5 align-top">
                      <p className="text-[12px] font-bold text-green-500 font-mono group-hover:underline cursor-pointer break-all max-w-[500px] whitespace-normal leading-relaxed">
                        <a href={`/errors/${err.id}`}>{err.message}</a>
                      </p>
                    </td>
                    <td className="px-4 py-5 text-center align-top">
                      <span className="bg-white/5 px-3 py-1 rounded text-[11px] font-black text-white">{err.count}</span>
                    </td>
                    <td className="px-4 py-5 text-center align-top">
  <div className="flex justify-center gap-1">
    {err.environments.includes("prod") && (
      <span className="px-2 py-1 rounded text-[9px] font-black uppercase
        bg-green-500/10 text-green-400 border border-green-500/20">
        Prod
      </span>
    )}
    {err.environments.includes("dev") && (
      <span className="px-2 py-1 rounded text-[9px] font-black uppercase
        bg-blue-500/10 text-blue-400 border border-blue-500/20">
        Dev
      </span>
    )}
  </div>
</td>
                    <td className="px-4 py-5 text-[14px] text-gray-200 font-bold uppercase tracking-tight align-top whitespace-nowrap">
                        {err.firstSeen ? new Date(err.firstSeen).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-5 text-[14px] text-gray-200 font-bold text-right align-top whitespace-nowrap">
                        {err.lastSeen ? new Date(err.lastSeen).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="mt-4 shrink-0 flex justify-between items-center opacity-60 text-[8px] font-black uppercase tracking-[0.5em]">
        <span>TraceAI infrastructure: optimal</span>
        <span>&copy; 2025 TraceAi</span>
      </footer>
    </div>
  );
}

// Sub-components
function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
      {children}
    </div>
  );
}

function CompactStat({ label, val, trend }: { label: string, val: string, trend: string }) {
  return (
    <div className="text-center px-4">
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-4 italic">{label}</p>
      <p className="text-6xl font-black leading-none mb-3 tracking-tighter italic">{val}</p>
      <div className="bg-green-600/10 px-2 py-1 rounded-md inline-block">
        <p className="text-[8px] font-black text-green-700 leading-none italic uppercase">{trend}</p>
      </div>
    </div>
  );
}