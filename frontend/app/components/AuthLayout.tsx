import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    // "h-screen" and "overflow-hidden" ensures no page scrolling
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-[35%_65%] bg-black text-white font-sans overflow-hidden">
      
      {/* LEFT SIDE - Scrollable internally if content is too tall, but page won't scroll */}
      <div className="flex flex-col justify-between px-8 py-12 lg:px-12 xl:px-20 border-r border-white/10 h-full">
        {/* Logo */}
        <div>
          <h1 className="flex items-center gap-1 text-2xl font-bold tracking-tight">
            <span className="text-white">Trace</span>
            <span className="text-[#00F575]">AI</span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
            {title}
          </h2>
          
          {children}
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-600">
          © 2026 TraceAI Inc.
        </div>
      </div>

      {/* RIGHT SIDE - Abstract Visuals (Restored design, new colors) */}
      <div className="hidden lg:flex relative bg-black items-center justify-center p-16 h-full">
        
        {/* Abstract Background Shapes (Recolored to Neon Green) */}
        
        {/* 1. Large Glow Bottom Right */}
        <div className="absolute -bottom-24 -right-24 w-[800px] h-[800px] bg-[#00F575] rounded-full blur-[120px] opacity-10 pointer-events-none" />
        
        {/* 2. Dark Overlay to create depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-black rounded-bl-[100%] z-10 pointer-events-none" />

        {/* 3. The Thin Thread Line (Recolored) */}
        <svg className="absolute top-20 left-10 w-[600px] h-[400px] z-20 opacity-60 pointer-events-none" viewBox="0 0 600 400" fill="none">
          <path d="M0 50 C 100 50, 200 150, 300 150 C 400 150, 500 50, 600 100" stroke="#00F575" strokeWidth="1" />
        </svg>

        {/* Content Layer */}
        <div className="relative z-30 max-w-2xl">
          <h2 className="text-7xl font-bold leading-tight mb-8 tracking-tighter">
            Understand failures <br />
            <span className="text-[#00F575]">instantly</span>
          </h2>
          
          <p className="text-neutral-400 text-xl mb-12 leading-relaxed max-w-lg">
            TraceAI groups errors by root cause so your team fixes what matters without digging through logs.
          </p>

          <a href="/documentation" className="group inline-flex items-center text-[#00F575] text-lg font-semibold hover:text-white transition-colors">
            Explore tutorial 
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}