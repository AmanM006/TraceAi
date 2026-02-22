"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link"; // ✅ Imported Link

type DropdownItem = {
  title: string;
  desc: string;
  icon: string;
  section?: string;  // ✅ Made section optional so TS doesn't yell when using href
  href?: string;     
};

export default function LandingPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Mock chart data for hero section
  const heroChartData = [
    { time: "00:08", count: 2 },
    { time: "00:23", count: 3 },
    { time: "00:38", count: 1 },
    { time: "00:53", count: 4 },
    { time: "01:08", count: 2 },
    { time: "01:23", count: 3 },
    { time: "01:38", count: 2 }
  ];

  const dropdownData: Record<string, DropdownItem[]> = {
    services: [
      { title: "Error Monitoring", desc: "Real-time error tracking and alerts", icon: "📊", section: "monitoring" },
      { title: "Root Cause Analysis", desc: "AI-powered error grouping", icon: "🔍", section: "analysis" },
      { title: "Performance Tracking", desc: "Monitor app performance metrics", icon: "⚡", section: "performance" },
      { title: "Custom Integrations", desc: "Connect with your tools", icon: "🔗", section: "integrations" }
    ],
    achievements: [
      { title: "99.9% Uptime", desc: "Industry-leading reliability", icon: "✓", section: "uptime" },
      { title: "500+ Teams", desc: "Trusted by leading companies", icon: "👥", section: "teams" },
      { title: "50M+ Errors Tracked", desc: "Processing at scale", icon: "📈", section: "scale" }
    ],
    traceai: [
      { title: "About Us", desc: "Our mission and vision", icon: "ℹ️", section: "about" },
      { title: "Documentation", desc: "Complete guides and API docs", icon: "📚", href: "/documentation" },
      { title: "Pricing", desc: "Plans for every team size", icon: "💰", section: "pricing" },
      { title: "Contact", desc: "Get in touch with our team", icon: "📧", section: "contact" }
    ]
  };

  const handleDropdownClick = (item: string) => {
    setOpenDropdown(null);
    // Scroll to section or navigate
    const element = document.getElementById(item);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // simple scroll fade-in
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // navbar scroll behavior
  useEffect(() => {
    let lastScroll = 0;
    const nav = document.getElementById("main-nav");
    
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        nav?.classList.remove("hide");
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav?.classList.add("hide");
      } else if (currentScroll < lastScroll) {
        nav?.classList.remove("hide");
      }
      
      lastScroll = currentScroll;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <header 
        id="main-nav"
        className="fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Left */}
          <span className="font-black tracking-tight text-xl">
            Trace<span className="text-green-400">AI</span>
          </span>

          {/* Center circular pill nav */}
          <div className="flex items-center gap-2 bg-white/5 px-2 py-2 rounded-full border border-white/10 backdrop-blur-xl relative">
            {["services", "achievements", "traceai"].map(item => (
              <div key={item} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item ? null : item)}
                  className="px-5 py-2 rounded-full text-sm text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  {item}
                  <svg 
                    className={`w-3 h-3 transition-transform ${openDropdown === item ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {openDropdown === item && (
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      {dropdownData[item].map((dropItem: DropdownItem, idx: number) => {
                        
                        // ✅ Reusable content block for both buttons and links
                        const innerContent = (
                          <>
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 transition">
                              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                                {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                                {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                                {idx > 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-semibold text-base mb-1">{dropItem.title}</p>
                              <p className="text-gray-500 text-sm leading-snug">{dropItem.desc}</p>
                            </div>
                          </>
                        );

                        // ✅ Conditionally render a Link if href exists
                        if (dropItem.href) {
                          return (
                            <Link
                              key={idx}
                              href={dropItem.href}
                              className="text-left p-4 rounded-xl hover:bg-gray-50 transition group flex items-start gap-4"
                            >
                              {innerContent}
                            </Link>
                          );
                        }

                        // ✅ Render a button for page scroll sections
                        return (
                          <button
                            key={idx}
                            onClick={() => dropItem.section && handleDropdownClick(dropItem.section)}
                            className="text-left p-4 rounded-xl hover:bg-gray-50 transition group flex items-start gap-4"
                          >
                            {innerContent}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right - Login & Sign up */}
          <div className="flex gap-3">
            <a
              href="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-green-400 text-black hover:bg-green-300 transition"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex items-center px-8 lg:px-24 pt-32">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="reveal">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
              Intelligent error monitoring
            </p>

            <h1 className="text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight mb-8">
              Understand failures <br />
              <span className="text-green-400">instantly</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
              TraceAI captures runtime errors, normalizes stacks, groups root
              causes, and shows what actually broke — not just what crashed.
            </p>

            <div className="flex gap-4">
              <a
                href="#signup"
                className="px-7 py-3.5 bg-green-400 text-black rounded-full font-medium text-base hover:bg-green-300 transition"
              >
                Start free
              </a>
              <a
                href="documentation"
                className="px-7 py-3.5 border border-white/20 rounded-full font-medium text-base hover:bg-white/10 transition"
              >
                View docs
              </a>
            </div>
          </div>

          {/* RIGHT VISUALS */}
          <div className="relative reveal lg:ml-12">
            {/* floating stat */}
            <div className="absolute -top-8 -left-8 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm z-10">
              <p className="text-xs text-gray-400 mb-2">In strong increase</p>
              <p className="text-4xl font-bold text-green-400">1,482</p>
              <p className="text-xs text-gray-500 mt-1">↑ 8.2% vs last week</p>
            </div>

            {/* main card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 h-[400px] backdrop-blur-sm">
              <div className="h-full w-full flex flex-col">
                {/* Active Error Feed Graph */}
                <div className="flex-1 relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Error Feed</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heroChartData} margin={{ top: 5, right: 140, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fill: '#6B7280', fontSize: 10 }} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          tick={{ fill: '#6B7280', fontSize: 10 }}
                          width={20}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0a0a0a', 
                            border: '1px solid rgba(34, 197, 94, 0.2)', 
                            borderRadius: '8px' 
                          }}
                          itemStyle={{ color: '#22C55E', fontSize: '12px' }}
                          labelStyle={{ color: '#9CA3AF', fontSize: '10px' }}
                        />
                        <Line
                          type="linear"
                          dataKey="count"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#22C55E', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#fff' }}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Error Distribution Donut Chart */}
                  <div className="absolute top-55 left-105 w-40 h-45 bg-black/90 backdrop-blur-[20px] border border-white/10 rounded-2xl p-4 shadow-2xl z-20" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Distribution</p>
                    <div className="relative w-full aspect-square">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full" preserveAspectRatio="xMidYMid meet">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(30, 30, 30)" strokeWidth="14"/>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(74, 222, 128)" strokeWidth="14" strokeDasharray="125 251" strokeDashoffset="0"/>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="14" strokeDasharray="75 251" strokeDashoffset="-125"/>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(22, 163, 74)" strokeWidth="14" strokeDasharray="51 251" strokeDashoffset="-200"/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-white">35</span>
                        <span className="text-[8px] text-gray-400 uppercase">Total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom status */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Live Monitoring</span>
                  <span className="text-xs text-green-400 font-semibold">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: Error Monitoring ================= */}
      <section id="monitoring" className="min-h-screen flex items-center px-8 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT TEXT */}
          <div className="reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-green-400 rounded-full"></div>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest">
                Real-time Monitoring
              </p>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-normal leading-tight tracking-tight mb-6">
              All Error Observations
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-6">
              Monitor runtime errors captured automatically with comprehensive insights into unique errors, total occurrences, and real-time activity feeds.
            </p>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Track detailed error observations with environment filtering, timestamps, and frequency analysis to quickly identify and resolve issues.
            </p>

            <button className="mt-8 text-green-400 font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View full error log
              <span>→</span>
            </button>
          </div>

          {/* RIGHT VISUAL - Error Log Table */}
          <div className="reveal lg:ml-12">
            <div className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              {/* Table Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">All Error Observations</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Full detailed log</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white/5 text-white text-xs rounded-lg font-medium">LATEST</button>
                  <button className="px-3 py-1.5 text-gray-500 text-xs rounded-lg">MOST FREQUENT</button>
                </div>
              </div>

              {/* Error List */}
              <div className="max-h-[400px] overflow-y-auto">
                {[
                  { msg: "Cannot read properties of undefined (reading 'includes')", count: 1, env: "DEV", time: "7:15:12 PM" },
                  { msg: "Objects are not valid as a React child", count: 1, env: "DEV", time: "7:06:52 PM" },
                  { msg: "Failed to fetch errors", count: 5, env: "DEV", time: "7:00:06 PM" },
                  { msg: "Network request timeout", count: 3, env: "PROD", time: "6:58:07 PM" }
                ].map((error, i) => (
                  <div key={i} className="bg-black/60 border border-white/5 rounded-xl p-4 hover:border-green-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-green-400 font-mono flex-1 pr-4 group-hover:text-green-300 transition">{error.msg}</p>
                      <span className="text-lg font-bold text-white">{error.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2.5 py-1 rounded font-medium ${
                          error.env === 'DEV' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {error.env}
                        </span>
                        <span className="text-xs text-gray-500">8/1/2026</span>
                      </div>
                      <span className="text-xs text-gray-400">{error.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">LIVE MONITORING</span>
                  </div>
                  <span className="text-xs text-green-400 font-medium">CONNECTED</span>
                </div>
                
                <button className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  EXPORT CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: Root Cause Analysis ================= */}
      <section id="analysis" className="min-h-screen flex items-center px-8 lg:px-24 py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* LEFT TEXT */}
    <div className="reveal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-green-400 rounded-full"></div>
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest">
          AI Intelligence
        </p>
      </div>
      
      <h2 className="text-5xl lg:text-6xl font-normal leading-tight tracking-tight mb-6 text-white">
        Automated Fix <br /> Suggestions
      </h2>
      
      <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-6">
        Stop guessing why your code is breaking. TraceAI uses Gemini-powered analysis to provide human-readable explanations and production-ready code fixes.
      </p>

      <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
        Identify exactly which line of code is responsible and receive verified solutions instantly, reducing your debugging time from hours to seconds.
      </p>

      <button className="mt-8 text-green-400 font-medium flex items-center gap-2 hover:gap-3 transition-all">
        <a href="documentation">See How It Works</a>
        <span>→</span>
      </button>
    </div>

    {/* RIGHT VISUAL - AI Diagnosis Interface */}
    <div className="reveal lg:ml-8">
      <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl p-8 backdrop-blur-sm max-w-xl relative overflow-hidden group">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">TraceAI Diagnostic</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">AI Analysis Engine</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">READY</span>
        </div>

        {/* Error Identity */}
        <div className="mb-6">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Captured Error</label>
          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
             <code className="text-red-400 text-sm font-mono">TypeError: Cannot read properties of undefined (reading 'includes')</code>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-green-500/[0.03] border border-green-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Root Cause Identified</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The variable <code className="text-white px-1 bg-white/5 rounded">errorData</code> is accessed before the API fetch completes in <code className="text-white">AnalyticsPage.tsx</code>. This happens because the component renders before the async effect finishes.
          </p>
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Suggested Solution</p>
            <div className="bg-black/60 rounded-xl p-4 font-mono text-xs border border-white/5">
              <span className="text-gray-500">// Use optional chaining to prevent crash</span><br />
              <span className="text-blue-400">const</span> <span className="text-white">total = errorData</span><span className="text-yellow-400">?.</span><span className="text-white">length </span><span className="text-yellow-400">||</span> <span className="text-orange-400">0</span><span className="text-white">;</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5">
          <span>Apply Fix Suggestion</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 px-10 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <p className="font-black text-2xl mb-4">
                Trace<span className="text-green-400">AI</span>
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Modern error intelligence for modern teams.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <p className="text-sm font-bold mb-4 text-white">services</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">Data Visualization</li>
                <li className="hover:text-white transition cursor-pointer">Data Engineering</li>
                <li className="hover:text-white transition cursor-pointer">Error Monitoring</li>
                <li className="hover:text-white transition cursor-pointer">Analytics</li>
              </ul>
            </div>

            {/* Achievements Column */}
            <div>
              <p className="text-sm font-bold mb-4 text-white">achievements</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">Success Stories</li>
                <li className="hover:text-white transition cursor-pointer">Certifications</li>
                <li className="hover:text-white transition cursor-pointer">Partners</li>
              </ul>
            </div>

            {/* TraceAI Column */}
            <div>
              <p className="text-sm font-bold mb-4 text-white">traceai</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">About</li>
                <li className="hover:text-white transition cursor-pointer">Team</li>
                <li className="hover:text-white transition cursor-pointer">Careers</li>
                <li className="hover:text-white transition cursor-pointer">Blog</li>
                <li className="hover:text-white transition cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">© 2026 TraceAI. All rights reserved.</p>
            
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-white transition">Cookies preferences</a>
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Credits</a>
            </div>
          </div>
        </div>
      </footer>

      {/* animations */}
      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s ease;
        }
        .reveal.show {
          opacity: 1;
          transform: translateY(0);
        }
        #main-nav {
          opacity: 1;
          transform: translateY(0);
        }
        #main-nav.hide {
          opacity: 0;
          transform: translateY(-100%);
          pointer-events: none;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}