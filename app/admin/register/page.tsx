"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const EyeIcon = ({ isVisible }: { isVisible: boolean }) =>
  isVisible ? <LuEye className="w-5 h-5" /> : <LuEyeClosed className="w-5 h-5" />;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const confirmationRedirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/admin/auth/callback?source=signup-confirmation`
      : "/admin/auth/callback?source=signup-confirmation";

  // Real-time field errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, color: "", text: "" };

    let score = 0;

    // Length checks
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Determine level and color
    if (score <= 2) return { level: 1, color: "bg-red-500", text: "Weak" };
    if (score <= 4) return { level: 2, color: "bg-orange-500", text: "Medium" };
    return { level: 3, color: "bg-green-500", text: "Strong" };
  }, [password]);

  // Validate field on blur
  const validateField = (field: string, value: string) => {
    const errors: typeof fieldErrors = {};

    switch (field) {
      case "name":
        if (!value.trim()) errors.name = "Full name is required";
        break;
      case "email":
        if (!value.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = "Please enter a valid email";
        break;
      case "password":
        if (!value) errors.password = "Password is required";
        else if (value.length < 8) errors.password = "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value) errors.confirmPassword = "Please confirm your password";
        break;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const formatAuthError = (message: string) => {
    const normalized = message.toLowerCase();
    if (normalized.includes("rate limit")) {
      return "Email rate limit exceeded. Please wait a bit and try again.";
    }
    return message;
  };

  useEffect(() => {
    if (!awaitingConfirmation) return;

    const supabase = createClient();
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (data.session) {
        window.location.href = "/admin";
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 4000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = "/admin";
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [awaitingConfirmation]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAwaitingConfirmation(false);

    // Validate all fields
    const errors: typeof fieldErrors = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      // Create the user and send a confirmation link
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmationRedirectUrl,
          data: {
            name: name,
          },
        },
      });

      if (signUpError) {
        setError(formatAuthError(signUpError.message));
      } else {
        setSuccess("We sent a confirmation link to your email. Click it to finish registration and continue to the admin page.");
        setAwaitingConfirmation(true);
      }
    } catch {
      setError("An unexpected error occurred");
    }
    setLoading(false);
  };

  const handleResendLink = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    const supabase = createClient();

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: confirmationRedirectUrl,
      },
    });

    if (resendError) {
      setError(formatAuthError(resendError.message));
    } else {
      setSuccess("Confirmation link resent. Please check your inbox.");
    }
    setLoading(false);
  };

  // Get input border color based on field state
  const getInputBorderColor = (fieldName: keyof typeof fieldErrors, value: string) => {
    if (!value) return "border-slate-600";
    return fieldErrors[fieldName] ? "border-red-500" : "border-teal-500";
  };

  if (awaitingConfirmation) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal-400">Allena Hub</h1>
            <p className="text-slate-400 mt-2">Confirm Your Email</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-slate-100">Waiting for confirmation</h2>
              <p className="text-slate-400 mt-2">
                We sent a confirmation link to <span className="text-teal-300">{email}</span>.
                Click the link to finish registration.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/-500 text-red10 border border-red-400 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-teal-500/10 border border-teal-400 text-teal-200 px-4 py-2 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendLink}
                disabled={loading}
                className="w-full text-teal-300 hover:text-teal-200 border border-teal-500/50 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Resending..." : "Resend confirmation link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAwaitingConfirmation(false);
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-slate-400 hover:text-teal-400 text-sm py-2 transition-colors"
              >
                Use a different email
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-6">
              This page will refresh automatically and redirect once your email is confirmed.
              The confirmation tab will also try to close itself after success.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Register Form */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          {error && (
            <div className="bg-red-500/-500 text-red10 border border-red-400 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-teal-500/10 border border-teal-400 text-teal-200 px-4 py-2 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSendMagicLink} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) validateField("name", e.target.value);
                  }}
                  onBlur={(e) => validateField("name", e.target.value)}
                  className={`w-full bg-slate-700 border rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getInputBorderColor("name", name)}`}
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) validateField("email", e.target.value);
                  }}
                  onBlur={(e) => validateField("email", e.target.value)}
                  className={`w-full bg-slate-700 border rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getInputBorderColor("email", email)}`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) validateField("password", e.target.value);
                    }}
                    onBlur={(e) => validateField("password", e.target.value)}
                    className={`w-full bg-slate-700 border rounded-lg px-4 py-3 pr-12 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getInputBorderColor("password", password)}`}
                    placeholder="Create a password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 z-10 p-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <EyeIcon isVisible={showPassword} />
                  </button>
                </div>
                {password && (
                  <>
                    {/* Password strength indicator */}
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        <div className={`h-1 flex-1 rounded ${passwordStrength.level >= 1 ? passwordStrength.color : "bg-slate-600"}`} />
                        <div className={`h-1 flex-1 rounded ${passwordStrength.level >= 2 ? passwordStrength.color : "bg-slate-600"}`} />
                        <div className={`h-1 flex-1 rounded ${passwordStrength.level >= 3 ? passwordStrength.color : "bg-slate-600"}`} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${passwordStrength.level === 1 ? "text-red-400" : passwordStrength.level === 2 ? "text-orange-400" : "text-green-400"}`}>
                          {passwordStrength.text}
                        </span>
                        {/* <span className="text-xs text-slate-400">
                          {password.length}/8 characters
                        </span> */}
                      </div>
                    </div>
                  </>
                )}
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) validateField("confirmPassword", e.target.value);
                    }}
                    onBlur={(e) => validateField("confirmPassword", e.target.value)}
                    className={`w-full bg-slate-700 border rounded-lg px-4 py-3 pr-12 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getInputBorderColor("confirmPassword", confirmPassword)}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 z-10 p-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <EyeIcon isVisible={showConfirmPassword} />
                  </button>
                </div>
                {/* Always show password match status when there's input */}
                {confirmPassword && (
                  <p className={`text-xs mt-1 ${password === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
                {fieldErrors.confirmPassword && confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Send Confirmation Link"}
              </button>
            </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-slate-400">Already have an account? </span>
          <Link href="/admin/login" className="text-teal-400 hover:text-teal-300 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
