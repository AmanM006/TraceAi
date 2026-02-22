"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthLayout from "../components/AuthLayout";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSignup() {
    if (loading) return;
  
    setLoading(true);
    setError(null);
  
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
  
    setLoading(false);
  
    if (error) {
      setError(error.message);
      return;
    }
  
    // ✅ IMPORTANT UX FIX
    setSuccess(
        "Account created! Please check your email to verify your account."
      );
        }
  
  

  return (
    <AuthLayout title="Create your account">
      <input
        placeholder="Email"
        className="w-full border rounded-lg px-3 py-2 mb-3"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        className="w-full border rounded-lg px-3 py-2 mb-4"
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && (
  <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-sm">
    {success}
  </div>
)}

      <button
  onClick={handleSignup}
  disabled={loading}
  className={`
    w-full py-3 rounded-lg font-medium transition
    ${loading 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-green-400 hover:bg-green-300 text-black"}
  `}
>
  {loading ? "Creating account..." : "Sign up"}
</button>


      <p className="text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 font-medium">
          Log in
        </a>
      </p>
    </AuthLayout>
  );
}
