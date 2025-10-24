"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-faith-blue rounded-full flex items-center justify-center">
              <i className="fas fa-cross text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-800">FaithConnect</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => router.push("/")} className="text-gray-600 hover:text-faith-blue transition-colors">Home</button>
            <button onClick={() => router.push("/community")} className="text-gray-600 hover:text-faith-blue transition-colors">Community</button>
            <button onClick={() => router.push("/create")} className="text-gray-600 hover:text-faith-blue transition-colors">Write</button>
            <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-faith-blue transition-colors">Dashboard</button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600 text-sm"></i>
            </div>
            <button className="md:hidden">
              <i className="fas fa-bars text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
