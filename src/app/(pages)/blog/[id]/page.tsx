"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "@/components/CommentCard";

const samplePost = {
  title: "Finding Peace Through Faith in Difficult Times",
  author: "John Doe",
  date: "Oct 18, 2025",
  image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1200&q=60",
  content: `In our journey of faith, we often encounter moments that test our patience and endurance. 
  But it is in these times that our trust in God is strengthened. 
  Faith gives us the courage to face the unknown, knowing that God’s plan is always good.`,
  likes: 143,
  comments: 12,
};

const sampleComments = [
  {
    author: "Mary W.",
    comment: "Such a beautiful reminder. God’s timing is truly perfect!",
    date: "Oct 19, 2025",
    likes: 7,
  },
  {
    author: "David K.",
    comment: "This post encouraged me a lot today. Thank you for sharing!",
    date: "Oct 19, 2025",
    likes: 5,
  },
  {
    author: "Sophie L.",
    comment: "Faith really does move mountains 🙏",
    date: "Oct 18, 2025",
    likes: 3,
  },
];

export default function BlogDetailPage() {
  return (
    <section className="py-20 bg-faith-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <img
          src={samplePost.image}
          alt={samplePost.title}
          className="w-full h-72 object-cover rounded-2xl shadow-md mb-8"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-3">{samplePost.title}</h1>

        <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
          <span>By {samplePost.author}</span>
          <span>{samplePost.date}</span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
          {samplePost.content}
        </p>

        <div className="flex items-center gap-6 text-faith-blue mb-12">
          <div className="flex items-center gap-2 cursor-pointer hover:text-faith-purple">
            <FontAwesomeIcon icon={faHeart} />
            {samplePost.likes}
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-faith-purple">
            <FontAwesomeIcon icon={faComment} />
            {samplePost.comments}
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-faith-purple">
            <FontAwesomeIcon icon={faShare} />
            Share
          </div>
        </div>

        {/* Comments Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {sampleComments.map((c, idx) => (
            <CommentCard key={idx} {...c} />
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("✅ Comment submitted (mock).");
          }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
        >
          <label className="block text-gray-700 font-medium mb-2">
            Add a Comment
          </label>
          <textarea
            placeholder="Share your thoughts..."
            className="w-full h-24 border rounded-lg p-3 focus:ring-2 focus:ring-faith-blue outline-none mb-3 resize-none"
          ></textarea>
          <button
            type="submit"
            className="bg-faith-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-faith-purple transition-all"
          >
            Post Comment
          </button>
        </form>
      </div>
    </section>
  );
}
