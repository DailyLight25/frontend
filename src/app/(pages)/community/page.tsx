import GroupCard from "@/components/GroupCard";

const sampleGroups = [
  {
    name: "Faith Warriors",
    description:
      "A group of believers passionate about intercession and prayer support.",
    members: 128,
    image:
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Bible Study Fridays",
    description:
      "Weekly deep dives into scripture with friendly discussion and reflection.",
    members: 87,
    image:
      "https://images.unsplash.com/photo-1608889175787-3cfcb0c6d3e9?auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Youth in Christ",
    description:
      "A vibrant group for young believers to share, learn, and grow together.",
    members: 203,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Worshippers United",
    description:
      "Musicians and singers gathering to praise, create, and glorify God through music.",
    members: 154,
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
  },
];

export default function CommunityPage() {
  return (
    <section className="py-20 bg-faith-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Community Hub
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Join prayer circles, Bible study groups, and faith communities. Connect
          with like-minded believers and grow in fellowship.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sampleGroups.map((group, idx) => (
            <GroupCard key={idx} {...group} />
          ))}
        </div>
      </div>
    </section>
  );
}
