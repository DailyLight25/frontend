import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-yellow-100 to-blue-50">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Share Your Light. Inspire the World.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Connect with a community of faith, share your reflections, and
            discover inspiration.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/explore"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition"
            >
              Explore Posts
            </Link>
            <Link
              to="/share"
              className="bg-white border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold px-8 py-3 rounded-lg shadow transition"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Trending Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-yellow-50 rounded-lg p-4 shadow">
            <div className="h-28 bg-yellow-200 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-1">
              Finding Peace in Prayer
            </h3>
            <div className="text-gray-500 text-sm mb-1">By Sarah Miller</div>
            <div className="text-xs text-gray-400">#Prayer #Faith</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow">
            <div className="h-28 bg-yellow-200 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-1">
              The Power of Forgiveness
            </h3>
            <div className="text-gray-500 text-sm mb-1">By David Thompson</div>
            <div className="text-xs text-gray-400">#Forgiveness #Love</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow">
            <div className="h-28 bg-blue-100 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-1">
              Living a Life of Purpose
            </h3>
            <div className="text-gray-500 text-sm mb-1">By Emily Carter</div>
            <div className="text-xs text-gray-400">#Purpose #Inspiration</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow">
            <div className="h-28 bg-blue-200 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-1">
              Overcoming Challenges with Faith
            </h3>
            <div className="text-gray-500 text-sm mb-1">By Michael Davis</div>
            <div className="text-xs text-gray-400">#Challenges #Hope</div>
          </div>
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="font-semibold mb-2">Verse of the Day</div>
          <div className="text-gray-700 mb-2">
            For God so loved the world that he gave his one and only Son, that
            whoever believes in him shall not perish but have eternal life. -
            John 3:16
          </div>
        </div>
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Open Bible"
            className="h-64 w-full object-cover rounded-lg shadow"
          />
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/write"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded shadow text-center"
          >
            Write a Post
          </Link>
          <Link
            to="/inspiration"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded shadow text-center"
          >
            Find Inspiration
          </Link>
          <Link
            to="/prayer-wall"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 rounded shadow text-center"
          >
            Prayer Wall
          </Link>
          <Link
            to="/community"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 rounded shadow text-center"
          >
            Community Forum
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
