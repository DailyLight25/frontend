import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Leaf, ShieldCheck, Users } from "lucide-react";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const highlights = useMemo(
    () => [
      {
        title: "Create belonging",
        description:
          "Start conversations, celebrate milestones, and keep discipleship close.",
        Icon: Users,
      },
      {
        title: "Grow with purpose",
        description:
          "Follow guided rhythms and custom journeys tailored to your faith walk.",
        Icon: Leaf,
      },
      {
        title: "Safe & supportive",
        description:
          "Verified spaces and community standards ensure authentic, caring dialogue.",
        Icon: ShieldCheck,
      },
    ],
    []
  );

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      setFieldErrors({});
      await register(data.username, data.email, data.password, data.confirmPassword);

      showNotification({
        type: "success",
        title: "Registration Successful",
        message:
          "A verification email has been sent. Please check your inbox to activate your account.",
        duration: 5000,
      });

      // Navigate to email verification page with email
      navigate(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("Registration failed:", error.message);

      const errorMessage =
        error.message || "Registration failed. Please try again.";

      if (
        errorMessage.includes("Username:") ||
        errorMessage.includes("Email:") ||
        errorMessage.includes("Password:") ||
        errorMessage.includes("Confirm Password:")
      ) {
        const errors: { [key: string]: string } = {};

        if (errorMessage.includes("Username:")) {
          errors.username = errorMessage.split("Username:")[1].split(".")[0].trim();
        }
        if (errorMessage.includes("Email:")) {
          errors.email = errorMessage.split("Email:")[1].split(".")[0].trim();
        }
        if (errorMessage.includes("Password:")) {
          errors.password = errorMessage.split("Password:")[1].split(".")[0].trim();
        }
        if (errorMessage.includes("Confirm Password:")) {
          errors.confirmPassword = errorMessage
            .split("Confirm Password:")[1]
            .split(".")[0]
            .trim();
        }

        setFieldErrors(errors);
      } else {
        showNotification({
          type: "error",
          title: "Registration Failed",
          message: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:w-2/5 lg:px-12 lg:py-16">
          <Link to="/" className="flex items-center gap-3 text-emerald-700">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-inner shadow-emerald-500/10">
              <Heart className="h-6 w-6" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold uppercase tracking-[0.4em]">
                DayLight
              </span>
              <span className="text-xs font-medium text-emerald-700/80">
                Build bright communities
              </span>
            </div>
          </Link>

          <div className="mt-16 space-y-8 text-gray-700">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Create your account
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Bring your light and voice to a community that celebrates every step of faith.
              </h1>
            </div>
            <div className="space-y-6">
              {highlights.map(({ title, description, Icon }) => (
                <div key={title} className="flex gap-4">
                  <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
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
            Already part of the community?
            <Link
              to="/auth/login"
              className="ml-2 font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-3/5 lg:px-16 lg:py-16">
          <div className="w-full max-w-lg space-y-6">
            <AuthForm
              type="register"
              onSubmit={handleRegister}
              errors={fieldErrors}
              isLoading={isLoading}
            />
            <p className="text-center text-sm text-gray-500">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 text-emerald-600 transition hover:text-emerald-700"
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

export default RegisterPage;