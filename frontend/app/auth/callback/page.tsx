"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      // This forces Supabase to read the hash token
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error("Auth failed:", error);
        router.replace("/login");
        return;
      }

      // ✅ USER IS CONFIRMED & LOGGED IN
      router.replace("/projects"); // or /projects
    };

    run();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <p className="text-sm text-gray-400">
        Verifying your account…
      </p>
    </div>
  );
}
