import BlogCard from "./BlogCard";

const sampleBlogs = [
  {
    title: "Finding Strength in Prayer During Hard Times",
    author: "John Doe",
    date: "Oct 15, 2025",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
    excerpt:
      "In times of trial, prayer becomes our anchor — guiding us back to peace and hope...",
    likes: 124,
    comments: 16,
  },
  {
    title: "How to Keep Your Faith Strong in College",
    author: "Mary W.",
    date: "Oct 12, 2025",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    excerpt:
      "With so many distractions, it's easy to drift — but here's how to stay spiritually grounded.",
    likes: 89,
    comments: 9,
  },
  {
    title: "Walking in Love: Lessons from 1 Corinthians 13",
    author: "Pastor Ben",
    date: "Oct 10, 2025",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=60",
    excerpt:
      "The Bible reminds us that love is patient, kind, and never self-seeking. Let's explore what that means for us today.",
    likes: 205,
    comments: 31,
  },
];

export default function BlogFeed() {
  return (
    <section className="py-20 bg-faith-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Featured Faith Blogs
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sampleBlogs.map((blog, idx) => (
            <BlogCard key={idx} {...blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
