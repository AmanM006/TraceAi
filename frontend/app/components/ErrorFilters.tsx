"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

// 🟢 1. Add the prop type so the component knows it will receive the count
export default function ErrorFilters({ totalErrors }: { totalErrors: number }) {
  const searchParams = useSearchParams();
  
  // 1. Get current values
  const sortParam = searchParams.get("sort");
  const envParam = searchParams.get("env");

  // 2. Determine effective active state
  const isLatest = sortParam === "latest" || !sortParam;
  const isCount = sortParam === "count";
  
  const isProd = envParam === "prod";
  const isDev = envParam === "dev";

  // 3. Smart Link Generator (Handles Toggling)
  const createQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      const currentValue = params.get(key);
      if (currentValue === value) {
        params.delete(key);
      } else {
        if (key === "sort" && value === "latest") {
           params.delete("sort");
        } else {
           params.set(key, value);
        }
      }
      
      return "?" + params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex items-center gap-3">
       <div className="flex items-center gap-3">
             {/* SORT BUTTONS */}
             <div className="flex bg-[#0A0A0A] border border-white/10 p-0.5 rounded-lg">
                 <Link 
                    href={createQueryString("sort", "latest")} 
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                        isLatest 
                        ? "bg-white/10 text-white shadow-sm" 
                        : "text-gray-600 hover:text-white hover:bg-white/5"
                    }`}
                 >
                    Latest
                 </Link>
                 <Link 
                    href={createQueryString("sort", "count")} 
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                        isCount 
                        ? "bg-white/10 text-white shadow-sm" 
                        : "text-gray-600 hover:text-white hover:bg-white/5"
                    }`}
                 >
                    Most Frequent
                 </Link>
             </div>
        </div>
        
        <span className="text-white/20">|</span>

        {/* ENVIRONMENT BUTTONS */}
        <div className="flex bg-[#0A0A0A] border border-white/10 p-0.5 rounded-lg">
            <Link 
                href={createQueryString("env", "prod")} 
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                    isProd
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-gray-500 hover:text-green-400 hover:bg-green-500/5"
                }`}
            >
                Prod
            </Link>
            <div className="w-[1px] bg-white/5 my-1"/>
            <Link 
                href={createQueryString("env", "dev")} 
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                    isDev
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-500 hover:text-blue-400 hover:bg-blue-500/5"
                }`}
            >
                Dev
            </Link>
        </div>
        
        {/* 🟢 2. ADD THIS: The Distinct Errors Counter */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Distinct Errors:</span>
          <span className="text-xs font-black text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
            {totalErrors}
          </span>
        </div>

    </div>
  );
}