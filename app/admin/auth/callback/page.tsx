"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // If successful, redirect to admin
      window.location.href = "/admin";
    };

    handleCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return null;
}
