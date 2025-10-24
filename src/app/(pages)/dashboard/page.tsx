"use client";

import DashboardPostCard from "@/components/DashboardPostCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faPen } from "@fortawesome/free-solid-svg-icons";

const sampleStats = {
  totalPosts: 12,
  totalLikes: 542,
  totalComments: 78,
};

const samplePosts = [
  {
    title: "Faith Over Fear: A Daily Choice",
    date: "Oct 20, 2025",
    likes: 128,
    comments: 23,
  },
  {
    title: "When God Feels Silent",
    date: "Oct 15, 2025",
    likes: 94,
    comments: 11,
  },
  {
    title: "Walking in Obedience",
    date: "Oct 10, 2025",
    likes: 75,
    comments: 6,
  },
];

export default function DashboardPage() {
  return (
    <section className="py-20 bg-faith-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Your Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Track your posts, engagement, and growth in the FaithConnect community.
        </p>

        {/* Analytics Overview */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <FontAwesomeIcon
              icon={faPen}
              className="text-faith-blue text-3xl mb-3"
            />
            <h3 className="text-2xl font-bold">{sampleStats.totalPosts}</h3>
            <p className="text-gray-600 text-sm">Total Posts</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-faith-purple text-3xl mb-3"
            />
            <h3 className="text-2xl font-bold">{sampleStats.totalLikes}</h3>
            <p className="text-gray-600 text-sm">Total Likes</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-faith-gold text-3xl mb-3"
            />
            <h3 className="text-2xl font-bold">{sampleStats.totalComments}</h3>
            <p className="text-gray-600 text-sm">Total Comments</p>
          </div>
        </div>

        {/* My Posts */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Recent Posts
        </h2>
        <div className="space-y-5">
          {samplePosts.map((post, idx) => (
            <DashboardPostCard key={idx} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
