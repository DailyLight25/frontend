"use client";

import { useRouter } from "next/navigation";
import BlogFeed from "@/components/BlogFeed";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-faith-blue to-faith-purple text-white min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <i className="fas fa-dove text-6xl mb-6 opacity-90"></i>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Share Your Faith, <br />
            <span className="text-faith-gold">Build Community</span>
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Connect with fellow believers through AI-powered blogging, join prayer
            groups, and grow together in faith with our supportive Christian
            community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-faith-gold text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <i className="fas fa-book-open mr-2"></i> Explore Blogs
            </button>

            <button
              onClick={() => router.push("/community")}
              className="bg-faith-gold text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <i className="fas fa-praying-hands mr-2"></i> Join Prayer Groups
            </button>

            <button
              onClick={() => router.push("/create")}
              className="bg-faith-gold text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <i className="fas fa-pen mr-2"></i> Start Writing
            </button>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full text-faith-cream"
          >
            <path
              fill="currentColor"
              d="M0,64L48,53.3C96,43,192,21,288,16C384,11,480,21,576,37.3C672,53,768,75,864,74.7C960,75,1056,53,1152,53.3C1248,53,1344,75,1392,85.3L1440,96V0H0Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="bg-faith-cream py-20 relative z-10">
        <BlogFeed />
      </section>
    </>
  );
}
