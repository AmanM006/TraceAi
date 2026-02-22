"use client";

import React from "react";

type ErrorRow = {
  id: string;
  message: string;
  count: number;
  firstSeen: string | null;
  lastSeen: string | null;
};

export default function ExportButton({ data }: { data: ErrorRow[] }) {
  const handleExport = () => {
    // 1. Define CSV Headers
    const headers = ["ID", "Message", "Count", "First Seen", "Last Seen"];

    // 2. Format Data Rows (handling commas/quotes in messages)
    const rows = data.map((row) => {
      const safeMessage = row.message.replace(/"/g, '""'); // Escape double quotes
      return [
        row.id,
        `"${safeMessage}"`, // Wrap message in quotes
        row.count,
        row.firstSeen || "",
        row.lastSeen || "",
      ].join(",");
    });

    // 3. Combine and Blob
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // 4. Trigger Download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `errors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  );
}