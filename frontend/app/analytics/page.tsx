"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import ProfileDropdown from "../components/ProfileDropDown";
import ErrorPieChart from "../components/ErrorPieChart"; 
import LiveChart from "../components/LiveChart"; 
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type ErrorRow = {
  id: string;
  message: string;
  count: number;
  environments: ("dev" | "prod")[]; 
  firstSeen: string;
  lastSeen: string;
  hasAI: boolean; // 🟢 Add this!
};

export default function AnalyticsPage() {
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const router = useRouter();
  // ✅ 1. Add state for the new real stats
  const [stats, setStats] = useState({
    total: { value: 0, trend: "0%", trendUp: false },
    unique: { value: 0, trend: "0%", trendUp: false },
    prod: { value: 0, trend: "0%", trendUp: false },
    healthScore: 100
  });
    
  const projectId = typeof window !== 'undefined' ? localStorage.getItem("active_project") : "";
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      // 🟢 1. Check if the user is actually logged in first
      const { data: { session } } = await supabase.auth.getSession();
      
      // 🟢 2. If no session exists, kick them out and stop execution
      if (!session) {
        router.push("/login");
        return; 
      }

      // 🟢 3. Proceed with data fetching only if authenticated
      if (!projectId) return;
        
      try {
        const [errorsRes, statsRes] = await Promise.all([
          fetch(`/api/errors?project=${projectId}`),
          fetch(`/api/analytics?project=${projectId}`)
        ]);
  
        if (!errorsRes.ok || !statsRes.ok) throw new Error("Failed to fetch");
          
        const errorsData = await errorsRes.json();
        const statsData = await statsRes.json();
          
        if (!cancelled) {
          setErrors(errorsData);
          setStats(statsData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchData();
    return () => { cancelled = true; };
  }, [projectId, router]); // Added router to dependency array
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      if (!projectId) return;
        
      try {
        // ✅ 2. Fetch BOTH APIs at the same time
        const [errorsRes, statsRes] = await Promise.all([
          fetch(`/api/errors?project=${projectId}`),
          fetch(`/api/analytics?project=${projectId}`)
        ]);
  
        if (!errorsRes.ok || !statsRes.ok) throw new Error("Failed to fetch");
          
        const errorsData = await errorsRes.json();
        const statsData = await statsRes.json();
          
        if (!cancelled) {
          setErrors(errorsData);
          setStats(statsData); // ✅ Save the real stats to state
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchData();
    return () => { cancelled = true; };
  }, [projectId]);
  
  // Get top 5 worst errors for the table
  const topOffenders = [...errors].sort((a, b) => b.count - a.count).slice(0, 5);
  const mostCommonError = topOffenders.length > 0 
    ? topOffenders[0].message 
    : "System operating normally";

  const aiAnalyzedCount = errors.filter(err => err.hasAI).length;
  const aiCoverageRate = errors.length > 0 
    ? Math.round((aiAnalyzedCount / errors.length) * 100) 
    : 0;  
  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans p-5 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6 pl-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg italic">T</span>
            </div>
            <span className="text-lg font-bold tracking-tighter">TraceAI</span>
          </div>
          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
            <Link href={projectId ? `/errors?project=${projectId}` : "/errors"} className="hover:text-white cursor-pointer transition-colors">
                Dashboard
             </Link>
             <Link href={projectId ? `/my-errors?project=${projectId}` : "/my-errors"} className="hover:text-white cursor-pointer transition-colors">
                My Errors
             </Link>
             {/* ACTIVE LINK */}
            <span className="text-white border-b-2 border-white pb-1 cursor-pointer">Analytics</span>
          </nav>
        </div>
        <ProfileDropdown />
      </header>

      {/* MAIN CONTENT AREA - SCROLLABLE IF NEEDED */}
      <div className="flex-1 overflow-y-auto pr-2 
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-[#333] 
            [&::-webkit-scrollbar-thumb]:rounded-full">
            
        {/* ROW 1: KPI STAT CARDS */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <StatCard 
            title="Total Occurrences" 
            value={stats.total.value} 
            trend={stats.total.trend} 
            trendUp={stats.total.trendUp} 
          />
          <StatCard 
            title="Unique Issues" 
            value={stats.unique.value} 
            trend={stats.unique.trend} 
            trendUp={stats.unique.trendUp} 
          />
          <StatCard 
            title="Production Errors" 
            value={stats.prod.value} 
            trend={stats.prod.trend} 
            trendUp={stats.prod.trendUp} 
          />
          <div className="col-span-3 bg-[#163020] rounded-[28px] p-6 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/20 blur-3xl rounded-full" />
             <h3 className="text-[10px] font-black text-green-300/50 uppercase tracking-[0.2em] relative z-10">System Health Score</h3>
             <div className="relative z-10 flex items-end gap-2">
               <span className="text-6xl font-black text-white tracking-tighter leading-none">{stats.healthScore}</span>
               <span className="text-green-400 font-bold mb-1">/100</span>
             </div>
          </div>
        </div>

        {/* ROW 2: MAIN CHARTS */}
        <div className="grid grid-cols-12 gap-6 mb-6 min-h-[350px]">
          {/* Main Volume Chart */}
          <div className="col-span-8 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Error Volume Over Time</h3>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">Last 7 Days</p>
              </div>
              <div className="bg-[#1A1A1A] rounded-lg p-1 flex text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <button className="px-3 py-1.5 bg-[#2A2A2A] text-white rounded-md">7D</button>
                <button className="px-3 py-1.5 hover:text-white transition">30D</button>
                <button className="px-3 py-1.5 hover:text-white transition">24H</button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <LiveChart errorData={errors} />
            </div>
          </div>

          {/* Environment Breakdown */}
          <div className="col-span-4 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Environment Split</h3>
             </div>
             <div className="flex-1 flex items-center justify-center">
                <ErrorPieChart errorData={errors} />
             </div>
          </div>
        </div>

        {/* ROW 3: LISTS & AI INSIGHTS */}
        <div className="grid grid-cols-12 gap-6 pb-6">
          
          {/* Top Offenders Table */}
          <div className="col-span-7 bg-[#111111] rounded-[28px] p-6 border border-white/5">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Top Offenders</h3>
            <div className="space-y-1">
              {topOffenders.map((err, i) => (
                <div key={err.id} className="group flex items-center justify-between p-3 hover:bg-white/[0.02] rounded-xl transition">
                  <div className="flex items-center gap-4 overflow-hidden pr-4">
                    <span className="text-[10px] font-black text-gray-600 w-4">0{i+1}</span>
                    <p className="text-[12px] font-mono text-gray-300 truncate">{err.message}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[11px] font-black text-white bg-white/5 px-3 py-1 rounded">{err.count}</span>
                  </div>
                </div>
              ))}
              {topOffenders.length === 0 && <p className="text-xs text-gray-600 font-mono p-3">No data available.</p>}
            </div>
          </div>

          {/* TraceAI Resolution Insights */}
{/* TraceAI Resolution Insights */}
<div className="col-span-5 bg-gradient-to-br from-[#111111] to-[#0a1a11] rounded-[28px] p-6 border border-white/5 relative overflow-hidden">
             <div className="absolute right-0 bottom-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full" />
             <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                TraceAI Insights
             </h3>
             
             <div className="space-y-4">
                <div className="bg-black/40 border border-green-500/10 p-4 rounded-2xl relative z-10">
                   <p className="text-[11px] font-bold text-gray-400 mb-1">Most common root cause</p>
                   {/* 🟢 DYNAMIC MOST COMMON ERROR */}
                   <p className="text-sm font-mono text-green-400 truncate" title={mostCommonError}>
                     {mostCommonError}
                   </p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center relative z-10">
                   <div>
                     <p className="text-[11px] font-bold text-gray-400 mb-1">AI Insight Coverage</p>
                     {/* 🟢 UPDATED TEXT TO MATCH REALITY */}
                     <p className="text-sm text-gray-200">Errors successfully analyzed</p>
                   </div>
                   {/* 🟢 DYNAMIC PERCENTAGE */}
                   <span className="text-2xl font-black text-white">{aiCoverageRate}%</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini Component for the KPI Cards
function StatCard({ title, value, trend, trendUp }: { title: string, value: number, trend: string, trendUp: boolean }) {
  return (
    <div className="col-span-3 bg-[#111111] rounded-[28px] p-6 border border-white/5 flex flex-col justify-between shadow-lg">
      <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">{title}</h3>
      <div>
        <p className="text-5xl font-black tracking-tighter text-white leading-none mb-3">
          {value.toLocaleString()}
        </p>
        <div className={`inline-flex px-2 py-1 rounded-md ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          <p className="text-[9px] font-black uppercase tracking-widest leading-none">
            {trendUp ? '↓ ' : '↑ '}{trend}
          </p>
        </div>
      </div>
    </div>
  );
}