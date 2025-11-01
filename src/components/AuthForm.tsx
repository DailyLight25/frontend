import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AuthFormProps {
  type: "login" | "register" | "reset";
  onSubmit: (data: any) => void;
  errors?: { [key: string]: string };
  isLoading?: boolean;
}

const titles: Record<AuthFormProps["type"], { title: string; subtitle: string }> = {
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to continue encouraging stories and prayer moments.",
  },
  register: {
    title: "Create Your Account",
    subtitle:
      "Join a community dedicated to shining light, sharing faith, and serving together.",
  },
  reset: {
    title: "Reset Your Password",
    subtitle: "We’ll send a secure link to help you get back into your account.",
  },
};

const loadingText: Record<AuthFormProps["type"], string> = {
  login: "Signing you in...",
  register: "Creating account...",
  reset: "Sending reset link...",
};

const defaultText: Record<AuthFormProps["type"], string> = {
  login: "Sign In",
  register: "Create Account",
  reset: "Send Reset Link",
};

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  errors = {},
  isLoading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="w-full rounded-3xl border border-blue-100/50 bg-white/80 p-8 shadow-xl shadow-blue-500/5 backdrop-blur">
      <div className="mb-8 space-y-2 text-left">
        <h2 className="text-2xl font-semibold text-gray-900">
          {titles[type].title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          {titles[type].subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === "register" && (
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`input-field pl-11 ${errors.username ? "border-rose-400" : ""}`}
                placeholder="Choose a display name"
                aria-invalid={Boolean(errors.username)}
                required
              />
            </div>
            {errors.username && (
              <p className="text-xs font-medium text-rose-500">{errors.username}</p>
            )}
          </div>
        )}

        {type === "login" && (
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`input-field pl-11 ${errors.username ? "border-rose-400" : ""}`}
                placeholder="Enter your username or email"
                aria-invalid={Boolean(errors.username)}
                required
              />
            </div>
            {errors.username && (
              <p className="text-xs font-medium text-rose-500">{errors.username}</p>
            )}
          </div>
        )}

        {type === "register" && (
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field pl-11 ${errors.email ? "border-rose-400" : ""}`}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                required
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-500">{errors.email}</p>
            )}
          </div>
        )}

        {type !== "reset" && (
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={type === "login" ? "current-password" : "new-password"}
                value={formData.password}
                onChange={handleChange}
                className={`input-field pl-11 pr-12 ${errors.password ? "border-rose-400" : ""}`}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-rose-500">{errors.password}</p>
            )}
          </div>
        )}

        {type === "register" && (
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field pl-11 pr-12 ${errors.confirmPassword ? "border-rose-400" : ""}`}
                placeholder="Re-enter your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                aria-label={
                  showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-rose-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {type === "login" && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Keep me signed in</span>
            </label>
            <Link
              to="/auth/reset-password"
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === "register"
              ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          } ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isLoading ? loadingText[type] : defaultText[type]}
          </span>
        </button>
      </form>

      <div className="mt-10 space-y-4 text-center">
        {type === "login" && (
          <p className="text-sm text-gray-600">
            New to DayLight?
            <Link
              to="/auth/register"
              className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        )}
        {type === "register" && (
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/auth/login"
              className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Sign in instead
            </Link>
          </p>
        )}
        {type === "reset" && (
          <p className="text-sm text-gray-600">
            Remember your password?
            <Link
              to="/auth/login"
              className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Back to login
            </Link>
          </p>
        )}
        {type !== "reset" && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4" />
            Your account is protected with multi-factor security.
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthForm;