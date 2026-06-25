import { useState, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@app/providers/AuthContext";

export function LoginPage() {
  const { isAuthenticated, login, verify2FALogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [totpCode, setTotpCode] = useState("");

  // Already logged in -> go to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (show2FAInput) {
      if (totpCode.length !== 6) {
        setError("Please enter a valid 6-digit code.");
        setIsLoading(false);
        return;
      }
      const success = await verify2FALogin(mfaToken, totpCode);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid verification code. Please try again.");
      }
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else if (result.requires2FA) {
      setShow2FAInput(true);
      setMfaToken(result.mfaToken || "");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
  };

  const steps = [
    { n: 1, label: "Sign in to", sub: "your account", active: true },
    { n: 2, label: "Access your", sub: "workspace", active: false },
    { n: 3, label: "Manage your", sub: "farm", active: false },
  ];

  const inputCls =
    "w-full rounded-xl border border-cardBorder bg-bgCard px-4 py-3 text-sm text-textHeading placeholder-textMuted outline-none transition-all focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/30";

  return (
    <div className="flex min-h-screen bg-bgMain">
      {/* ─── LEFT: Video panel ─── */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Video background */}
        <video
          src="/no-text.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-bgMain/90 via-bgMain/60 to-accentPrimary/15" />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-end px-10 pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 text-4xl font-bold leading-tight text-textHeading xl:text-5xl"
          >
            Welcome Back
            <br />
            to CropNow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-xs text-sm leading-relaxed text-textSecondary"
          >
            Sign in to your account to manage your smart farm.
          </motion.p>

          {/* Step cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3"
          >
            {steps.map((s) => (
              <div
                key={s.n}
                className={[
                  "flex w-[120px] flex-col items-center rounded-2xl px-3 py-4 text-center",
                  s.active
                    ? "border border-cardBorder bg-cardBg backdrop-blur-md"
                    : "border border-borderSubtle bg-cardBg",
                ].join(" ")}
              >
                <span
                  className={[
                    "mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                    s.active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-cardBg text-textHint",
                  ].join(" ")}
                >
                  {s.n}
                </span>
                <span
                  className={[
                    "text-xs leading-snug",
                    s.active ? "text-textHeading" : "text-textHint",
                  ].join(" ")}
                >
                  {s.label}
                  <br />
                  <span className="font-semibold">{s.sub}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT: Form panel ─── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-textHeading">
            {show2FAInput ? "Two-Factor Verification" : "Sign In"}
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            {show2FAInput ? "Enter the verification code to secure your account." : "Enter your credentials to access your account."}
          </p>

          {/* Divider */}
          {!show2FAInput && (
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-cardBg" />
              <span className="text-xs text-textHint">Or</span>
              <div className="h-px flex-1 bg-cardBg" />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {show2FAInput ? (
              <div className="space-y-4">
                <p className="text-sm text-textSecondary leading-relaxed">
                  Two-factor authentication is enabled on your account. Please enter the 6-digit verification code sent to your email to complete sign-in.
                </p>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-textLabel">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.5em] font-mono rounded-xl border border-cardBorder bg-bgCard px-4 py-3 text-lg text-textHeading placeholder-textMuted outline-none transition-all focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/30"
                    required
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-textLabel">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="eg. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-textLabel">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputCls + " pr-10"}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textHint transition hover:text-textSecondary"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex items-center justify-end text-sm">
                  <button
                    type="button"
                    onClick={() => window.alert("Contact support to reset your password.")}
                    className="text-textLabel hover:text-textHeading transition"
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? (show2FAInput ? "Verifying..." : "Signing in...") : (show2FAInput ? "Verify & Sign In" : "Sign In")}
              </button>

              {show2FAInput && (
                <button
                  type="button"
                  onClick={() => {
                    setShow2FAInput(false);
                    setError("");
                    setTotpCode("");
                  }}
                  className="w-full rounded-xl border border-cardBorder bg-transparent py-3 text-sm font-semibold text-textHeading hover:bg-cardBg transition"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-textHint">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-textHeading cursor-pointer hover:underline"
            >
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
