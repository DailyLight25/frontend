import React from "react";
import { Link } from "react-router-dom";
import { Heart, LifeBuoy, MailCheck, Shield } from "lucide-react";
import AuthForm from "../../components/AuthForm";

const ResetPasswordPage: React.FC = () => {
  const handleReset = (data: any) => {
    console.log("Reset data:", data);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-100/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.08),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:w-2/5 lg:px-12 lg:py-16">
          <Link to="/" className="flex items-center gap-3 text-blue-700">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-inner shadow-blue-500/10">
              <Heart className="h-6 w-6" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold uppercase tracking-[0.4em]">
                DayLight
              </span>
              <span className="text-xs font-medium text-blue-700/80">
                Caring for every step
              </span>
            </div>
          </Link>

          <div className="mt-16 space-y-10 text-gray-700">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Need a reset?
              </p>
              <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                It happens. Let’s securely guide you back into your account.
              </h1>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MailCheck className="mt-1 h-5 w-5 text-blue-500" />
                <p>We’ll send a password reset link to the email address you use for DayLight.</p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 text-emerald-500" />
                <p>Links are time-sensitive and protected to make sure only you can reset your access.</p>
              </div>
              <div className="flex items-start gap-3">
                <LifeBuoy className="mt-1 h-5 w-5 text-indigo-500" />
                <p>If you need additional help, reach out to your ministry lead or support team.</p>
              </div>
            </div>
          </div>

          <p className="mt-16 text-xs text-gray-500">
            Remembered your password?
            <Link
              to="/auth/login"
              className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Back to login
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-3/5 lg:px-16 lg:py-16">
          <div className="w-full max-w-lg space-y-6">
            <AuthForm type="reset" onSubmit={handleReset} />
            <p className="text-center text-sm text-gray-500">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 text-blue-600 transition hover:text-blue-700"
              >
                <span aria-hidden>←</span>
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;