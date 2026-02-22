import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Occurrence = {
  id: string;
  created_at: string;
  environment: string;
  commit_sha: string;
};

type ErrorDetail = {
  id: string;
  raw_message: string;
  raw_stack: string | null;
  normalized_message: string;
  normalized_stack: string | null;
  occurrences: Occurrence[];
  ai_suggestion?: string; // Adding this since your backend generates it!
};

async function getError(id: string): Promise<ErrorDetail> {
  const res = await fetch(
    `http://localhost:3000/api/errors/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch error");
  }

  return res.json();
}

export default async function ErrorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const error = await getError(id);
// 🟢 ADD THIS: Clean up Gemini's overzealous markdown wrapping
const cleanSuggestion = error.ai_suggestion
?.replace(/^```(markdown)?\n?/i, '') // Strips starting ```markdown
.replace(/\n?```$/i, '')             // Strips ending ```
.trim();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans p-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/my-errors" 
          className="text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-8"
        >
          <span>←</span> Back to Errors
        </Link>

        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-3">
              Error Investigation
            </h1>
            <h2 className="text-3xl font-bold tracking-tighter text-white break-all">
              {error.raw_message}
            </h2>
          </div>
          
          <div className="bg-[#111111] border border-white/5 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Occurrences</p>
            <p className="text-3xl font-black text-white">{error.occurrences?.length || 0}</p>
          </div>
        </div>

        {/* AI SUGGESTION BOX (If you have it hooked up) */}
        {error.ai_suggestion && (
          <div className="mb-8 bg-green-900/10 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <h3 className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              TraceAI Analysis
            </h3>
            
            {/* 2. Replace the simple <p> tag with ReactMarkdown */}
{/* 2. Custom Styled ReactMarkdown */}
{/* 2. Custom Styled ReactMarkdown */}
<div className="text-sm text-gray-300 leading-relaxed max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-black text-white mt-8 mb-4 tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mt-8 mb-3 border-b border-white/10 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-6 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-green-500" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-green-500" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  
                  // Updated Pre (Code Block Container)
                  pre: ({node, ...props}) => (
                    <div className="relative my-6">
                      <div className="absolute inset-0 bg-white/5 rounded-xl"></div>
                      <pre className="relative border border-white/10 rounded-xl p-4 overflow-x-auto shadow-2xl" {...props} />
                    </div>
                  ),
                  
                  // Updated Code Styling
                  code: ({node, inline, className, children, ...props}: any) => {
                    return !inline ? (
                      // Block code (gray text, readable)
                      <code className="text-[13px] font-mono text-gray-300 leading-loose" {...props}>
                        {children}
                      </code>
                    ) : (
                      // Inline code (keeps the green highlight)
                      <code className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[11px] font-mono border border-green-500/20" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {/* 🟢 Make sure to use the cleaned variable here! */}
                {cleanSuggestion}
              </ReactMarkdown>
            </div>       </div> )}

        {/* STACK TRACE */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
              Raw Stack Trace
            </h3>
            <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
              Copy Stack
            </button>
          </div>
          
          <div className="p-6 overflow-x-auto">
            {error.raw_stack ? (
              <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                {error.raw_stack}
              </pre>
            ) : (
              <p className="text-sm text-gray-600 font-mono italic">
                No stack trace provided for this error.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}