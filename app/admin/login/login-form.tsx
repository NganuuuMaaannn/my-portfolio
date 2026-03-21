"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { FaGoogle } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const EyeIcon = ({ isVisible }: { isVisible: boolean }) =>
  isVisible ? <LuEye className="h-5 w-5" /> : <LuEyeClosed className="h-5 w-5" />;

type AdminLoginFormProps = {
  initialError?: string;
};

export default function AdminLoginForm({ initialError = "" }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const displayError = error || initialError;

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/admin";
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          {displayError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
              {displayError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-6xl xl:text-5xl">
                Allena
                <span className="ml-2 font-bold inline-flex rounded-md bg-[#81e6d9] px-3 py-0 text-slate-950">
                  Hub
                </span>
              </h1>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or continue with email</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex md:text-base text-xs items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-800 font-medium py-3 rounded-lg transition-colors mt-4 disabled:opacity-50"
            >
              <FaGoogle className="text-xl " />
              Sign in with HCDC Google Account
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/admin/register" className="text-teal-400 hover:text-teal-300 transition-colors">
              Sign Up
            </Link>
          </p>
          <Link href="/" className="block text-slate-400 hover:text-teal-400 transition-colors">
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
