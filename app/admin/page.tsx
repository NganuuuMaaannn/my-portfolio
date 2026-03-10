import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin - Allena Hub",
  description: "Admin dashboard for Allena Hub",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-400">Admin Dashboard</h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-slate-300 hover:text-teal-400 transition-colors">
              View Site
            </Link>
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-slate-300">
                {user.user_metadata?.name || user.email}
              </span>
              <form action={handleSignOut}>
                <button 
                  type="submit"
                  className="text-slate-300 hover:text-orange-400 transition-colors ml-2"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-xl text-slate-300">
            Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}!
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-teal-400">6</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-2">Certificates</h3>
            <p className="text-3xl font-bold text-orange-400">4</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-2">Contact Messages</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-2">Page Views</h3>
            <p className="text-3xl font-bold text-purple-400">-</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Project
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Certificate
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Manage Content
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-slate-400">No recent activity to display.</p>
        </div>
      </main>
    </div>
  );
}
