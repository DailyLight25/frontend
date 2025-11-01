import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";

const VerifyEmailPage: React.FC = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-blue-100/40">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_55%)]" />
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16 sm:px-10">
      <div className="w-full max-w-xl rounded-3xl border border-amber-100 bg-white/90 p-10 text-center shadow-xl shadow-amber-200/40 backdrop-blur">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <MailCheck className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-gray-900">
          Check your inbox for a verification link
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          We’ve sent an email with a secure link to activate your DayLight account. Follow the
          instructions inside to confirm your email address and start sharing your light.
        </p>

        <div className="mt-8 space-y-3 text-left text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-emerald-500" />
            <p>The link keeps your account safe by making sure it’s really you joining the community.</p>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="mt-1 h-5 w-5 text-blue-500" />
            <p>Didn’t receive the email? Check your spam folder or request a new link from the login page.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
          >
            Continue to login
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-600 transition hover:border-amber-300 hover:text-amber-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default VerifyEmailPage;