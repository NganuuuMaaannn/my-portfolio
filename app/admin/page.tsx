import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getPortfolioPath } from "@/app/components/portfolio/data";
import { PortfolioEditor } from "@/app/admin/portfolio-editor";
import { getPortfolioForUser } from "@/lib/portfolio-store";
import { createClient } from "@/lib/supabase/server";

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

  const { portfolio, errorMessage } = await getPortfolioForUser(user);
  const publicPath = getPortfolioPath(portfolio.portfolioSlug);
  const userLabel = user.user_metadata?.name || user.email || "Admin";
  const userInitial = userLabel.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-400">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage the portfolio content for your account and public route.
            </p>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href={publicPath}
              target="_blank"
              className="text-slate-300 hover:text-teal-400 transition-colors"
            >
              View Portfolio
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-teal-300">
                {userInitial}
              </div>
              <span className="text-slate-300">
                {userLabel}
              </span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="ml-2 text-slate-300 transition-colors hover:text-orange-400"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl text-slate-300">
            Welcome back, {user.user_metadata?.name || user.email?.split("@")[0]}.
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Each student account owns one portfolio row, and the public page is served from
            its saved slug, such as <span className="text-teal-300">{publicPath}</span>.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-2 text-sm uppercase tracking-wide text-slate-400">
              Portfolio Slug
            </h3>
            <p className="text-xl font-bold text-teal-400">{portfolio.portfolioSlug}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-2 text-sm uppercase tracking-wide text-slate-400">
              Total Projects
            </h3>
            <p className="text-3xl font-bold text-teal-400">{portfolio.projects.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-2 text-sm uppercase tracking-wide text-slate-400">
              Certificates
            </h3>
            <p className="text-3xl font-bold text-orange-400">
              {portfolio.certificates.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-2 text-sm uppercase tracking-wide text-slate-400">
              Visibility
            </h3>
            <p className="text-3xl font-bold text-blue-400">
              {portfolio.isPublished ? "Live" : "Draft"}
            </p>
          </div>
        </div>

        <PortfolioEditor
          userId={user.id}
          initialPortfolio={portfolio}
          initialErrorMessage={errorMessage}
        />
      </main>
    </div>
  );
}
