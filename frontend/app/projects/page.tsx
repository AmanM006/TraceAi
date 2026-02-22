"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Make sure this path is correct for your project structure
import ProfileDropdown from "../components/ProfileDropDown"; 

type Project = {
  id: string;
  name: string;
  api_key: string | null;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const router = useRouter();
  useEffect(() => {
    const verifyAuthAndLoad = async () => {
      // 1. Check if the user is actually logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. If no session exists, kick them out immediately
      if (!session) {
        router.push("/login");
        return; 
      }

      // 3. If they ARE logged in, proceed normally
      setActiveProject(localStorage.getItem("active_project"));
      loadProjects();
    };

    verifyAuthAndLoad();
  }, [router]);
  
  useEffect(() => {
    setActiveProject(localStorage.getItem("active_project"));
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
  }

  async function createProject() {
    if (!name.trim() || loading) return;
    setLoading(true);

    const res = await fetch("/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);
    setName("");

    if (!res.ok) {
      alert("Failed to create project");
      return;
    }

    const project = await res.json();
    setProjects((prev) => [project, ...prev]);
    setSelectedProject(project);
    setShowSettings(true);
  }

  function openSettings(project: Project) {
    setSelectedProject(project);
    setShowSettings(true);
  }

  function switchProject(id: string) {
    localStorage.setItem("active_project", id);
    setActiveProject(id);
    router.push(`/errors?project=${id}`);
  }

  function copyKey(key: string, projectId: string) {
    navigator.clipboard.writeText(key);
    setCopiedProjectId(projectId);
    setTimeout(() => setCopiedProjectId(null), 1500);
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans p-5 flex flex-col relative overflow-hidden">
      
      {/* 🟢 AMBIENT BACKGROUND GLOW (Fills the dead space) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),rgba(255,255,255,0))] pointer-events-none z-0" />

      {/* 🟢 HEADER (Grounds the page layout) */}
      <header className="relative z-50 flex items-center justify-between mb-12 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/5 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-6 pl-2">
          <Link href="/projects" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg italic">T</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">TraceAI</span>
          </Link>
          <nav className="flex gap-6 text-[12px] font-bold text-gray-500">
            <Link href={activeProject ? `/errors?project=${activeProject}` : "/errors"} className="hover:text-white transition-colors">Dashboard</Link>
            <Link href={activeProject ? `/my-errors?project=${activeProject}` : "/my-errors"} className="hover:text-white transition-colors">My Errors</Link>
          </nav>
        </div>
        {/* We use the dropdown you just upgraded! */}
        <ProfileDropdown />
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1">
        
        {/* HEADER & CREATE BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Workspaces</h1>
            <p className="text-sm text-gray-400">Create and manage your TraceAI integrations and API keys.</p>
          </div>

          <div className="flex bg-[#111111] p-1.5 rounded-2xl border border-white/5 w-full md:w-96 shadow-lg focus-within:border-green-500/30 focus-within:ring-1 focus-within:ring-green-500/10 transition-all">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createProject()}
              placeholder="New project name..."
              className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600 font-medium w-full"
            />
            <button
              onClick={createProject}
              disabled={loading || !name.trim()}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Create"}
            </button>
          </div>
        </div>

        {/* PROJECT CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group relative bg-[#111111] rounded-[24px] p-8 flex flex-col justify-between h-52 transition-all duration-300 ${
                activeProject === project.id
                  ? "border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.05)]"
                  : "border border-white/5 hover:border-white/10"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white truncate pr-4 tracking-tight">{project.name}</h3>
                  {activeProject === project.id && (
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                <button
                  onClick={() => openSettings(project)}
                  className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M15 14v4M15 14l-2 -2M15 14l2 -2M12 4v2M12 18v2M4 12h2M18 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42 -1.42M16.24 7.76l1.42 -1.42" />
                  </svg>
                  API KEY
                </button>

                <button
                  onClick={() => switchProject(project.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeProject === project.id
                      ? "bg-white/5 text-white cursor-default"
                      : "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5"
                  }`}
                  disabled={activeProject === project.id}
                >
                  {activeProject === project.id ? "Viewing" : "Open Dashboard"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SETTINGS / API KEY MODAL (Unchanged from before) */}
      {showSettings && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-[28px] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[50px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white mb-1">Project Settings</h2>
              <p className="text-sm text-gray-400 mb-8">{selectedProject.name}</p>

              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Integration API Key</label>
                <div className="bg-black border border-white/10 rounded-xl p-1 flex items-center gap-2 relative group">
                  <div className="flex-1 overflow-x-auto scrollbar-hide px-3">
                    <code className="text-green-400 text-sm font-mono whitespace-nowrap">
                      {selectedProject.api_key}
                    </code>
                  </div>
                  <button
                    onClick={() => copyKey(selectedProject.api_key!, selectedProject.id)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                      copiedProjectId === selectedProject.id
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {copiedProjectId === selectedProject.id ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        Copied
                      </>
                    ) : (
                      "Copy Key"
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-2">
                  Use this key in your <code className="text-gray-300 bg-white/5 px-1 rounded">TraceAI.init()</code> configuration. Keep it secret.
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}