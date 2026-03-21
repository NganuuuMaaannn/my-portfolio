"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ConfirmedPage() {
  useEffect(() => {
    let closeTimer: number | null = null;
    let redirectTimer: number | null = null;

    const adminUrl = `${window.location.origin}/admin`;

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

    return () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
      }

      if (redirectTimer !== null) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, []);

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
