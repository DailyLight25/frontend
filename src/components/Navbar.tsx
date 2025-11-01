import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Heart,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type NavLink = {
  name: string;
  href: string;
};

const primaryLinks: NavLink[] = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Community", href: "/coming-soon/dashboard" },
];

const authenticatedExtras: NavLink[] = [
  { name: "Feed", href: "/home" },
  { name: "Dashboard", href: "/coming-soon/dashboard" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("keyup", closeOnEscape);
    return () => document.removeEventListener("keyup", closeOnEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const navigationLinks = isAuthenticated
    ? [...authenticatedExtras, ...primaryLinks]
    : [{ name: "Home", href: "/" }, ...primaryLinks];

  const isActive = (href: string) =>
    href !== "/" && href !== "/home"
      ? location.pathname.startsWith(href)
      : location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unreadNotifications = 0;

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "border-b border-transparent",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-gray-100 shadow-sm"
          : "bg-white/80 backdrop-blur-md",
      ].join(" ")}
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-gray-900">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10">
            <Heart className="h-5 w-5 text-blue-600" />
            <span className="absolute inset-0 rounded-2xl border border-blue-100" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold uppercase tracking-[0.2em] text-blue-700">
              DayLight
            </span>
            <span className="text-xs font-medium text-gray-500">
              Build bright communities
            </span>
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-8 md:flex">
          {navigationLinks.map(({ name, href }) => (
            <Link
              key={name}
              to={href}
              className={[
                "relative text-sm font-medium transition-all duration-200",
                isActive(href)
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-blue-600",
              ].join(" ")}
            >
              {name}
              <span
                className={[
                  "absolute -bottom-2 left-0 h-0.5 w-full origin-left rounded-full transition-transform duration-300",
                  isActive(href)
                    ? "bg-gradient-to-r from-blue-600 to-indigo-400 scale-x-100"
                    : "bg-gradient-to-r from-blue-300 to-indigo-200 scale-x-0 group-hover:scale-x-100",
                ].join(" ")}
                aria-hidden
              />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="relative rounded-full border border-transparent bg-white p-2 text-gray-500 transition hover:border-blue-100 hover:text-blue-600"
                aria-label={
                  unreadNotifications > 0
                    ? `You have ${unreadNotifications} unread notifications`
                    : "Notifications"
                }
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {Math.min(unreadNotifications, 9)}
                    {unreadNotifications > 9 ? "+" : ""}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="rounded-full border border-transparent bg-white p-2 text-gray-500 transition hover:border-blue-100 hover:text-blue-600"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full bg-blue-50/70 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                  <span className="max-w-[110px] truncate">
                    {user?.username ?? "Profile"}
                  </span>
                </button>

                {isProfileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white/95 shadow-xl backdrop-blur"
                  >
                    <div className="border-b border-gray-100 bg-blue-50/40 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      View profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/coming-soon/dashboard");
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Sign out
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white p-2 text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={[
          "md:hidden",
          "transition-all duration-300",
          isMenuOpen
            ? "pointer-events-auto max-h-[480px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-4 mb-4 overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-xl backdrop-blur">
          <div className="space-y-1 px-4 pt-4 pb-3 text-sm font-medium text-gray-600">
            {navigationLinks.map(({ name, href }) => (
              <Link
                key={name}
                to={href}
                className={[
                  "block rounded-full px-4 py-2",
                  isActive(href)
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-blue-50 hover:text-blue-700",
                ].join(" ")}
                onClick={() => setIsMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 text-sm">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-blue-50 px-4 py-2.5 text-left font-semibold text-blue-700"
                >
                  {user?.username ?? "Profile"}
                  <User className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-2 text-gray-600">
                  <span>Notifications</span>
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                    {unreadNotifications}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                >
                  Sign out
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-2xl border border-gray-200 px-4 py-2 text-center font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-700"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-2xl bg-blue-600 px-4 py-2 text-center font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;