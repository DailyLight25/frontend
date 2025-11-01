import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Globe,
  Heart,
  MessageCircle,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiService from "../services/apiService";

type FeatureCard = {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
};

const features: FeatureCard[] = [
  {
    title: "Guided Prayer Wall",
    description:
      "Lift one another up with dedicated spaces for prayer requests, praise reports, and follow-up encouragement.",
    Icon: MessageCircle,
    accent: "bg-blue-100 text-blue-600",
  },
  {
    title: "Stories that Inspire",
    description:
      "Share testimonies, devotionals, and multimedia reflections that keep your community fueled throughout the week.",
    Icon: Heart,
    accent: "bg-rose-100 text-rose-600",
  },
  {
    title: "Globe-Ready Outreach",
    description:
      "Translate easily, stream sessions, and reach believers wherever they call home with accessible design choices.",
    Icon: Globe,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Event Planning & Rhythms",
    description:
      "Coordinate gatherings, track participation, and keep everyone informed about upcoming services and initiatives.",
    Icon: CalendarDays,
    accent: "bg-amber-100 text-amber-600",
  },
  {
    title: "Safe & Trusted Spaces",
    description:
      "Moderation tools and verified memberships protect your conversations and keep your community thriving.",
    Icon: ShieldCheck,
    accent: "bg-slate-100 text-slate-600",
  },
  {
    title: "Always-On Ministry",
    description:
      "Automated reminders, live sessions, and guided journeys help you stay spiritually connected 24/7.",
    Icon: Radio,
    accent: "bg-indigo-100 text-indigo-600",
  },
];

interface CommunityMetric {
  key: string;
  label: string;
  value: number;
}

const STATS_REFRESH_MS = 30000;

const benefits = [
  {
    title: "Stay rooted in scripture",
    copy: "Receive curated devotionals, personalized reading plans, and verse prompts that keep hearts centered on truth.",
  },
  {
    title: "Lead with confidence",
    copy: "Equip your leadership team with dashboards, scheduling tools, and communication flows that scale with your ministry.",
  },
  {
    title: "Spark meaningful action",
    copy: "Transform inspiration into impact with guided challenges, giving campaigns, and service opportunities.",
  },
];

const LandingPage: React.FC = () => {
  const [metrics, setMetrics] = useState<CommunityMetric[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

  const formatStatValue = useCallback(
    (value: number) => {
      const absValue = Math.abs(value);

      if (absValue >= 1_000_000_000) {
        return `${(value / 1_000_000_000)
          .toFixed(1)
          .replace(/\.0$/, "")}B`;
      }

      if (absValue >= 1_000_000) {
        return `${(value / 1_000_000)
          .toFixed(1)
          .replace(/\.0$/, "")}M`;
      }

      if (absValue >= 1_000) {
        return `${(value / 1_000)
          .toFixed(1)
          .replace(/\.0$/, "")}K`;
      }

      return numberFormatter.format(value);
    },
    [numberFormatter]
  );

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await apiService.get("core/stats/");

        if (!isMounted) {
          return;
        }

        const incomingMetrics: CommunityMetric[] = Array.isArray(response?.metrics)
          ? response.metrics
              .filter(
                (metric: any) =>
                  metric &&
                  typeof metric.value === "number" &&
                  (typeof metric.label === "string" || typeof metric.key === "string")
              )
              .map((metric: any) => ({
                key: metric.key ?? metric.label,
                label: metric.label ?? metric.key ?? "",
                value: metric.value,
              }))
          : [];

        setMetrics(incomingMetrics);
        setOnlineUsers(
          typeof response?.online_users === "number" ? response.online_users : null
        );
        setStatsError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatsError("Unable to load community stats right now.");
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();
    const interval = window.setInterval(loadStats, STATS_REFRESH_MS);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const formattedMetrics = useMemo(
    () =>
      metrics.map((metric) => ({
        ...metric,
        formattedValue: formatStatValue(metric.value),
      })),
    [metrics, formatStatValue]
  );

  const tickerItems = useMemo(
    () =>
      formattedMetrics.length > 0
        ? [...formattedMetrics, ...formattedMetrics]
        : [],
    [formattedMetrics]
  );

  const formattedOnlineUsers = useMemo(() => {
    if (onlineUsers === null) {
      return statsLoading ? "…" : "—";
    }

    return numberFormatter.format(onlineUsers);
  }, [numberFormatter, onlineUsers, statsLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-yellow-100 opacity-70"
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1 bg-white/80 border border-blue-100 text-blue-600 rounded-full text-sm font-medium shadow-sm">
                <Sparkles className="h-4 w-4" />
                Faith-first digital community
              </span>
              <h1 className="mt-6 text-3xl sm:text-2xl lg:text-4xl font-semibold leading-tight">
                Build a brighter world through shared devotion and prayer.
              </h1>
              <p className="mt-6 text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
                DayLight helps your ministry stay connected with encouraging stories, guided prayer moments, and tools that nurture spiritual growth wherever you are.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
                >
                  Join the Community
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-white text-blue-700 border border-blue-100 hover:border-blue-200 shadow-sm gap-2 transition"
                >
                  View Features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  Verified, safe conversations
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Compassionate member care
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  Accessible worldwide
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CalendarDays className="h-5 w-5 text-amber-500" />
                  Guided rhythms & events
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-sm shadow-xl border border-blue-100/60 p-3 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Community Snapshot</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      Sunrise Fellowship
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-sm"
                    aria-live="polite"
                  >
                    <Users className="h-4 w-4" />
                    {formattedOnlineUsers}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-2xl border border-gray-100 p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">
                        Morning Devotional
                      </div>
                      <span className="text-xs text-gray-500">Live · 12 min</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      “Let your light shine before others...” — Join Pastor Grace as we reflect together.
                    </p>
                    <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                      <Play className="h-4 w-4" />
                      Join session
                    </button>
                  </div>
                  <div className="rounded-sm border border-gray-100 p-2 shadow-sm bg-blue-50/60">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow">
                        <MessageCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Prayer Requests
                        </div>
                        <p className="text-sm text-gray-600">
                          32 friends are asking for prayer today.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Healing", "Family", "Guidance", "Thanksgiving"].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-white/80 border border-blue-100 rounded-full text-blue-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-20"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-20"
                aria-hidden="true"
              />
              <div
                className={`flex min-w-max items-center gap-10 whitespace-nowrap py-4 px-6 ${
                  tickerItems.length ? "animate-marquee" : ""
                }`}
                aria-live="polite"
              >
                {tickerItems.length ? (
                  tickerItems.map((metric, index) => (
                    <div
                      key={`${metric.key ?? metric.label}-${index}`}
                      className="flex flex-none items-baseline gap-2 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-base font-semibold text-blue-700 sm:text-lg">
                        {metric.formattedValue}
                      </span>
                      <span className="uppercase tracking-wide text-xs sm:text-sm text-gray-500">
                        {metric.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    {statsLoading
                      ? "Gathering community stats..."
                      : statsError ?? "Community insights coming soon."}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                <Radio className="h-4 w-4" />
                Why DayLight
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                Tools designed for thriving faith communities
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Whether you lead a ministry or nurture personal devotion, DayLight helps cultivate meaningful connection every day of the week.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(({ Icon, title, description, accent }) => (
                <div
                  key={title}
                  className="group relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl p-3 ${accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <p className="text-sm uppercase tracking-wide font-medium">
                  Community voices
                </p>
              </div>
              <blockquote className="mt-6 text-xl sm:text-2xl font-medium leading-relaxed">
                “DayLight helps our church stay present with members throughout the week. The prayer wall and guided reflections keep us connected and encouraged.”
              </blockquote>
              <p className="mt-8 text-sm font-medium">
                Pastor Naomi • Rise &amp; Shine Ministries
              </p>
            </div>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {benefit.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center bg-white rounded-3xl shadow-xl border border-blue-100/60 py-14">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Bring your light to a welcoming digital home
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Create spaces for prayer, encouragement, and actionable discipleship. Launch in minutes with tailored onboarding support.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
              >
                Start for Free
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 border border-blue-100 hover:border-blue-200 font-semibold"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
