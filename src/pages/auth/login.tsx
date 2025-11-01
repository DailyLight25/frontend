import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LockKeyhole, Sparkles, Users } from "lucide-react";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const highlights = useMemo(
    () => [
      {
        title: "Stay spiritually connected",
        description:
          "Pick up where you left off with devotionals, notes, and community updates.",
        Icon: Sparkles,
      },
      {
        title: "Join trusted circles",
        description:
          "Engage in verified spaces focused on prayer, encouragement, and growth.",
        Icon: Users,
      },
      {
        title: "Secure access",
        description:
          "Your account is protected with layered security and session safeguards.",
        Icon: LockKeyhole,
      },
    ],
    []
  );

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      setFieldErrors({});
      await login(data.username, data.password);

      showNotification({
        type: "success",
        title: "Login Successful",
        message: "Welcome back! You have been logged in successfully.",
        duration: 3000,
      });

      navigate("/home");
    } catch (error: any) {
      console.error("Login failed:", error);

      showNotification({
        type: "error",
        title: "Login Failed",
        message: error.message || "Invalid credentials or account not active.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:w-2/5 lg:px-12 lg:py-16">
          <Link to="/" className="flex items-center gap-3 text-blue-800">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-inner shadow-blue-500/10">
              <Heart className="h-6 w-6" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold uppercase tracking-[0.4em]">
                DayLight
              </span>
              <span className="text-xs font-medium text-blue-700/80">
                Share light. Inspire the world.
              </span>
            </div>
          </Link>

          <div className="mt-16 space-y-8 text-gray-700">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Welcome back
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Step back into a community that prays, encourages, and grows together.
              </h1>
            </div>
            <div className="space-y-6">
              {highlights.map(({ title, description, Icon }) => (
                <div key={title} className="flex gap-4">
                  <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-16 text-xs text-gray-500">
            Need an account?
            <Link
              to="/auth/register"
              className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Create one now
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-3/5 lg:px-16 lg:py-16">
          <div className="w-full max-w-lg space-y-6">
            <AuthForm
              type="login"
              onSubmit={handleLogin}
              errors={fieldErrors}
              isLoading={isLoading}
            />
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

export default LoginPage;