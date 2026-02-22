import React from "react";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-green-500/30">
      
      {/* SIMPLE NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg italic">T</span>
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">TraceAI</span>
        </Link>
        <div className="flex gap-6 text-sm font-bold text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-white border-b-2 border-white pb-1">Docs</span>
        </div>
      </nav>

      {/* DOCS LAYOUT */}
      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-12 items-start">
        
        {/* LEFT SIDEBAR - Table of Contents */}
        <aside className="w-64 shrink-0 sticky top-24 hidden md:block">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">On this page</h3>
          <ul className="space-y-4 text-sm font-bold text-gray-400">
            <li><a href="#quickstart" className="text-green-400">Quickstart Guide</a></li>
            <li><a href="#step-1" className="hover:text-white transition-colors">1. Install Package</a></li>
            <li><a href="#step-2" className="hover:text-white transition-colors">2. Environment Variables</a></li>
            <li><a href="#step-3" className="hover:text-white transition-colors">3. Initialize SDK</a></li>
            <li><a href="#step-4" className="hover:text-white transition-colors">4. Test Integration</a></li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-3xl">
          <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter text-white mb-4">Documentation</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Everything you need to integrate TraceAI into your Next.js application and start monitoring errors instantly.
            </p>
          </div>

          <div id="quickstart" className="space-y-16">
            
            {/* STEP 1 */}
            <section id="step-1">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 text-sm font-black">1</span>
                Install the SDK
              </h2>
              <p className="text-gray-400 mb-4 text-sm">Install the official TraceAI client package via npm.</p>
              
              <CodeBlock code={`npm install traceai-sdk-official`} />
            </section>

            {/* STEP 2 */}
            <section id="step-2">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 text-sm font-black">2</span>
                Environment Variables
              </h2>
              <p className="text-gray-400 mb-4 text-sm">Add your project keys to your target application's <code className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">.env.local</code> file.</p>
              
              <CodeBlock code={`NEXT_PUBLIC_TRACEAI_KEY=your_project_api_key_here
NEXT_PUBLIC_TRACEAI_INGEST_URL=https://your-traceai-domain.com/api/error`} />
            </section>

            {/* STEP 3 */}
            <section id="step-3">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 text-sm font-black">3</span>
                Initialize the SDK
              </h2>
              <p className="text-gray-400 mb-4 text-sm">Create a provider component at <code className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">components/TraceProvider.tsx</code> to automatically attach the global error tripwires, and wrap it around your <code className="text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">app/layout.tsx</code>.</p>
              
              <CodeBlock code={`"use client";

import { useEffect } from "react";
import { TraceAI } from "traceai-sdk-official";

export default function TraceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initializes global listeners and configures the endpoint
    TraceAI.init({
      apiKey: process.env.NEXT_PUBLIC_TRACEAI_KEY || "",
      endpoint: process.env.NEXT_PUBLIC_TRACEAI_INGEST_URL || "/api/error",
      environment: process.env.NODE_ENV === "production" ? "prod" : "dev",
    });
  }, []);

  return <>{children}</>;
}`} />
            </section>

            {/* STEP 4 */}
            <section id="step-4">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 text-sm font-black">4</span>
                Trigger a Test Crash
              </h2>
              <p className="text-gray-400 mb-4 text-sm">Drop this button anywhere in your app to verify the SDK is successfully beaming errors to your dashboard.</p>
              
              <CodeBlock code={`<button 
  onClick={() => { throw new Error("TraceAI Connection Test!"); }}
  className="bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded transition-colors"
>
  Crash App
</button>`} />
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

// Helper Component for syntax-like code blocks
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-transparent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center px-4 py-2 bg-white/[0.02] border-b border-white/5">
           <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
           </div>
        </div>
        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-gray-300 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}