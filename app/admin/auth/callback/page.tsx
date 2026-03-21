"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let closeTimer: number | null = null;
    let redirectTimer: number | null = null;

    const handleCallback = async () => {
      const currentUrl = new URL(window.location.href);
      const isSignupConfirmation =
        currentUrl.searchParams.get("source") === "signup-confirmation";
      const supabase = createClient();
      const code = currentUrl.searchParams.get("code");

      const sessionResult = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : await supabase.auth.getSession();

      if (sessionResult.error) {
        setError(sessionResult.error.message);
        setLoading(false);
        return;
      }

      if (!sessionResult.data.session) {
        setError("Confirmation succeeded, but no active session was found yet.");
        setLoading(false);
        return;
      }

      const adminUrl = `${window.location.origin}/admin`;

      if (!isSignupConfirmation) {
        window.location.replace(adminUrl);
        return;
      }

      setConfirmed(true);
      setLoading(false);

      if (window.opener && !window.opener.closed) {
        try {
          window.opener.location.href = adminUrl;
        } catch {
          // Ignore cross-window navigation issues and continue with local fallback.
        }
      }

      closeTimer = window.setTimeout(() => {
        window.close();

        redirectTimer = window.setTimeout(() => {
          window.location.replace(adminUrl);
        }, 1200);
      }, 1200);
    };

    handleCallback();

    return () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
      }

      if (redirectTimer !== null) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-50">Email confirmed</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This window will try to close automatically. If it stays open, continue to the
            admin dashboard.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            Continue to Admin
          </Link>
        </div>
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
