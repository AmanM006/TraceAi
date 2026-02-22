"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
// Adjust the import path to wherever your AuthLayout is
import AuthLayout from "../components/AuthLayout"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // 1. Initial check (Catches users who are already logged in from a previous visit)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/projects"; 
      } else {
        setCheckingSession(false); 
      }
    });

    // 2. Auth Listener (CRUCIAL for email verification links!)
    // This fires the moment Supabase finishes parsing the email link URL in the background.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/projects";
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    if (loading) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // FULL reload so server sees session
    window.location.href = "/projects";
  }

  // LOADING SCREEN (prevents flicker)
  if (checkingSession) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p className="text-sm text-neutral-500 animate-pulse">
          Checking session…
        </p>
      </div>
    );
  }

  return (
    <AuthLayout title="Log in to your account">
      <input
        placeholder="Email"
        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-3 mb-3 text-white focus:outline-none focus:border-[#00F575] placeholder-neutral-600 transition-colors"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-[#00F575] placeholder-neutral-600 transition-colors"
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full py-3 rounded-full font-bold transition-colors ${
          loading
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            : "bg-[#00F575] hover:bg-[#00db69] text-black"
        }`}
      >
        {loading ? "Logging in…" : "Sign in"}
      </button>

      <p className="text-sm mt-6 text-neutral-500 text-center">
        Don’t have an account?{" "}
        <a href="/signup" className="text-[#00F575] font-medium hover:underline">
          Start for free
        </a>
      </p>
    </AuthLayout>
  );
}