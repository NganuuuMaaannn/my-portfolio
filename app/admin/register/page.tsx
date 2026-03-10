"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type RegisterStep = "form" | "otp";

export default function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>("form");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time field errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    username?: string;
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
      case "username":
        if (!value.trim()) errors.username = "Username is required";
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
        else if (value !== password) errors.confirmPassword = "Passwords do not match";
        break;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors: typeof fieldErrors = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (!username.trim()) errors.username = "Username is required";
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
      // First, create the user account with password
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
          data: {
            name: name,
            username: username,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Now send OTP for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        setError(otpError.message);
      } else {
        setStep("otp");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      // Verify the OTP (supports both 6 and 8 digits)
      const { error: verifyError, data } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
      } else {
        // Success! Redirect to admin
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("OTP resent! Enter the new code.");
    }
    setLoading(false);
  };

  // Get input border color based on field state
  const getInputBorderColor = (fieldName: keyof typeof fieldErrors, value: string) => {
    if (!value) return "border-slate-600";
    return fieldErrors[fieldName] ? "border-red-500" : "border-teal-500";
  };

  // Eye icon component
  const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      {isVisible ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">Allena Hub</h1>
          <p className="text-slate-400 mt-2">Create Admin Account</p>
        </div>

        {/* Register Form */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          {error && (
            <div className="bg-red-500/-500 text-red10 border border-red-400 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) validateField("username", e.target.value);
                  }}
                  onBlur={(e) => validateField("username", e.target.value)}
                  className={`w-full bg-slate-700 border rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getInputBorderColor("username", username)}`}
                  placeholder="Choose a username"
                />
                {fieldErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
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
                        <span className="text-xs text-slate-400">
                          {password.length}/8 characters
                        </span>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
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
                {loading ? "Sending OTP..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-slate-300">We sent a code to</p>
                <p className="text-teal-400 font-medium">{email}</p>
              </div>

              {/* OTP Input - Now supports 8 digits */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="00000000"
                  maxLength={8}
                  required
                />
                <p className="text-slate-400 text-xs mt-1 text-center">
                  Enter the {otp.length}/8 digit code from your email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full text-slate-400 hover:text-teal-400 text-sm py-2 transition-colors disabled:opacity-50"
              >
                Didn't receive the code? Resend
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-slate-400 hover:text-teal-400 text-sm py-2 transition-colors"
              >
                ← Change email
              </button>
            </form>
          )}
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
