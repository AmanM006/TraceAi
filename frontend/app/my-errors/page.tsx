"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LiveChart from "../components/LiveChart"; 
import ExportButton from "../components/ExportButton"; 
import Link from "next/link"; 
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

import ErrorPieChart from "../components/ErrorPieChart"; 
import ProfileDropdown from "../components/ProfileDropDown";
import ErrorFilters from "../components/ErrorFilters";

type ErrorRow = {
  id: string;
  message: string;
  count: number;
  environments: ("dev" | "prod")[]; 
  firstSeen: string;
  lastSeen: string;
  hasAI: boolean; 
};

export default function MyErrorsPage() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "latest";
  const env = searchParams.get("env") ?? "";
  const router = useRouter();

  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  // 1. AUTH VERIFICATION EFFECT
  useEffect(() => {
    const verifyAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return; 
      }
      
      // If we reach here, user is logged in
      setIsAuthVerified(true);
    };

    verifyAuth();
  }, [router]);

  // 2. DATA LOADING EFFECT
  useEffect(() => {
    if (!isAuthVerified) return; // Don't fetch until we know user is logged in

    let cancelled = false;
  
    async function fetchErrors() {
      const projectId = localStorage.getItem("active_project");
      
      if (!projectId) {
        if (!cancelled) setErrors([]);
        return;
      }
      
      try {
        const res = await fetch(`/api/errors?sort=${sort}&env=${env}&project=${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (!cancelled) setErrors(data);
      } catch (err) {
        console.error(err);
      }
    }
  
    fetchErrors();
  
    return () => {
      cancelled = true;
    };
  }, [sort, env, isAuthVerified]);

  const projectId = typeof window !== 'undefined' ? localStorage.getItem("active_project") : "";

  // Optional: prevent flickering by returning null or a skeleton if not verified
  if (!isAuthVerified) return <div className="min-h-screen bg-black" />;

  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans p-5 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6 pl-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg italic">T</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">TraceAI</span>
          </div>
          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
            <Link href={projectId ? `/errors?project=${projectId}` : "/errors"} className="hover:text-white cursor-pointer transition-colors">Dashboard</Link>
            <Link href={projectId ? `/my-errors?project=${projectId}` : "/my-errors"} className="text-white border-b-2 border-white pb-1 cursor-pointer">My Errors</Link>
            <Link href={projectId ? `/analytics?project=${projectId}` : "/analytics"} className="hover:text-white cursor-pointer transition-colors">Analytics</Link>
          </nav>
        </div>
        
        <ProfileDropdown />
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: DETAILED TABLE */}
        <div className="col-span-8 bg-[#111111] rounded-[28px] border border-white/5 flex flex-col overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white">All Error Observations</h2>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Full detailed log</p>
                </div>
                <div className="flex items-center gap-3">
                    <ErrorFilters totalErrors={errors.length} />
                    <ExportButton data={errors} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 
                [&::-webkit-scrollbar]:w-1.5 
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-[#333] 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                hover:[&::-webkit-scrollbar-thumb]:bg-[#555]">
                
                <table className="w-full text-left table-fixed">
                    <thead className="sticky top-0 bg-[#111111] z-10 shadow-sm shadow-black/50">
                        <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black border-b border-white/5">
                            <th className="px-4 py-4 w-[50%]">Message</th>
                            <th className="px-4 py-4 text-center w-[15%]">Count</th>
                            <th className="py-4 text-center w-24">Environment</th>
                            <th className="px-4 py-4 w-[15%]">First Seen</th>
                            <th className="px-4 py-4 text-right w-[20%]">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {errors.map(err => (
                            <tr key={err.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-4 align-top">
                                    <p className="text-[13px] font-bold text-green-500 font-mono group-hover:underline cursor-pointer leading-relaxed break-all whitespace-normal">
                                        <Link href={`/errors/${err.id}`}>
                                            {err.message}
                                        </Link>
                                    </p>
                                    {err.hasAI ? (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                          </svg>
                                          AI Analyzed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
                                          <svg className="w-2.5 h-2.5 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Analyzing...
                                      </span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-center align-top">
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
                                <td className="px-4 py-4 text-[13px] text-gray-300 font-bold uppercase tracking-tight align-top">
                                    {err.firstSeen ? new Date(err.firstSeen).toLocaleString() : "-"}
                                </td>
                                <td className="px-4 py-4 text-[13px] text-gray-300 font-bold text-right align-top">
                                    {err.lastSeen ? new Date(err.lastSeen).toLocaleString(): "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* RIGHT COLUMN: CHARTS */}
        <div className="col-span-4 flex flex-col gap-6 h-full">
            <div className="flex-1 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col justify-between min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Active Error Feed</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                </div>
                
                <div className="flex-1 w-full min-h-0">
                    <LiveChart errorData={errors} />
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">
                    <span>Live Monitoring</span>
                    <span className="text-green-500">Connected</span>
                </div>
            </div>

            <div className="flex-1 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col justify-between min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Error Distribution</h3>
                    <div className="flex items-center gap-1">
                         <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                         <span className="text-[8px] font-bold text-gray-500 uppercase">Top Issues</span>
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-0">
                    <ErrorPieChart errorData={errors} />
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">
                    <span>By Frequency</span>
                    <span className="text-gray-600">Last 30 Days</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}