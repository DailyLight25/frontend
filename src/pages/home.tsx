import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  CheckCircle,
  Bell,
  Globe,
  Plus,
  FileUp,
  Heart,
  BookOpen,
  MessageCircle,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";

// --- Interfaces ---
interface ReactionCounts {
  heart: number;
  pray: number;
  comment: number;
}

interface FeedPost {
  id: number;
  title: string;
  content: string;
  verse: string;
  author: string;
  time: string;
  tags: string[];
  thumbnail: string;
  reactions: ReactionCounts;
  comments: number;
  attachments: boolean;
}

interface PrayerRequest {
  prayer_count: number;
  contenting: string;
  is_anonymous: boolean;
  prayed: boolean;
  post: string;
}

interface UserData {
  displayName: string;
  avatar: string;
  verified: boolean;
  unreadNotifications: number;
  cached: boolean;
  isAdmin: boolean;
}

// --- Component ---
const HomePage: React.FC = () => {
  const { user: authUser } = useAuth();
  
  // State
  const [user, setUser] = useState<UserData | null>(null);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "sw">("en");
  // const [offline] = useState(false);

  // Form states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newPrayer, setNewPrayer] = useState({ content: "", anonymous: false });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // New states for Scripture Search
  const [scriptureSearchQuery, setScriptureSearchQuery] = useState("");
  const [scriptureResults, setScriptureResults] = useState<any[] | null>(null);
  const [scriptureError, setScriptureError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Replace "YOUR_API_KEY_HERE" with your actual API key
  const BIBLE_API_KEY = import.meta.env.VITE_BIBLE_API_KEY;

  // Fetch user, feed, and prayer requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use authenticated user data
        if (authUser) {
          setUser({
            displayName: authUser.username,
            avatar: authUser.profile_picture || "",
            verified: authUser.is_verified,
            unreadNotifications: 0, // TODO: Implement notifications
            cached: true,
            isAdmin: false, // TODO: Add admin field to user model
          });
        }

        // Fetch posts
        const postsRaw = await apiService.get("posts/posts/");
        const posts: FeedPost[] = postsRaw.map((p: any) => ({
          id: p.id,
          title: p.title,
          content: p.content.slice(0, 100) + "...", // or use a backend-provided excerpt
          verse: p.scripture_refs?.[0] || "",
          author: p.author,
          time: new Date(p.created_at).toLocaleString(), // or use a relative time function
          tags: p.tags || [],
          thumbnail: p.thumbnail || "",
          reactions: p.reactions || { heart: 0, pray: 0, comment: 0 },
          comments: p.comments || 0,
          attachments: p.attachments || false,
        }));
        setFeed(posts);

        // Fetch prayer requests
        const prayersRaw = await apiService.get(
          "prayer_requests/prayer_requests/"
        );
        const prayers: PrayerRequest[] = prayersRaw.map((p: any) => ({
          prayer_count: p.prayer_count || 0,
          content: p.content || "",
          is_anonymous: p.is_anonymous || false,
          prayed: p.prayed || false,
          post: p.post,
        }));
        setPrayerRequests(prayers);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [authUser]);

  // Handlers for quick actions
  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post("posts/posts/", newPost);
      setShowPostModal(false);
      setNewPost({ title: "", content: "" });
      // Refresh feed
      const posts = await apiService.get("posts/posts/");
      setFeed(posts);
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  // ... inside HomePage: React.FC = () => {
  // ... existing handlers

  const handleScriptureSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptureSearchQuery.trim()) return;

    const BIBLE_ID = import.meta.env.VITE_BIBLE_ID;
    // Use the search query to construct the appropriate API call.
    // NOTE: This example uses a *general* search. For specific verses (e.g., "Gen 1:1"),
    // you would typically need a more complex endpoint like /v1/bibles/{bibleId}/search?query=...
    const SEARCH_ENDPOINT = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(
      scriptureSearchQuery
    )}`;

    setIsSearching(true);
    setScriptureError(null);
    setScriptureResults(null);

    try {
      const response = await fetch(SEARCH_ENDPOINT, {
        headers: {
          "api-key": BIBLE_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch scripture. Check API key and query.");
      }

      const data = await response.json();
      // Assuming search results are under data.data.results
      setScriptureResults(data.data.verses || data.data.passages.content);
    } catch (error) {
      console.error("Scripture Search Error:", error);
      setScriptureError(
        "Could not perform search. Check the API key or try a different query."
      );
    } finally {
      setIsSearching(false);
    }
  };

  // ...

  const handlePrayerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post("prayer_requests/prayer_requests/", newPrayer);
      setShowPrayerModal(false);
      setNewPrayer({ content: "", anonymous: false });
      // Refresh prayer requests
      const prayers = await apiService.get("prayer_requests/prayer_requests/");
      setPrayerRequests(prayers);
    } catch (err) {
      alert("Failed to submit prayer request.");
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}`,
        {
          method: "POST",
          headers: {
            ...apiService.getAuthHeader?.(), // If you expose getAuthHeader
          },
          body: formData,
        }
      );
      setShowUploadModal(false);
      setUploadFile(null);
      alert("File uploaded!");
    } catch (err) {
      alert("Failed to upload file.");
    }
  };

  // Button styles
  const baseBtnClasses =
    "px-3 py-2 rounded-lg font-medium transition-colors duration-150 shadow-sm";
  const primaryBtnClasses = `${baseBtnClasses} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryBtnClasses = `${baseBtnClasses} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

      {/* Welcome Header */}
      <section className="pt-20 pb-6 px-4 bg-gradient-to-br from-yellow-100 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.displayName?.replace(
                  /\s/g,
                  "+"
                )}&background=random&color=fff`
              }
              alt={`${user?.displayName}'s avatar`}
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-gray-800">
                  Welcome back, {user?.displayName}
                </span>
                {user?.verified && (
                  <CheckCircle
                    className="text-blue-500 h-4 w-4 flex-shrink-0"
                    // title="Verified User"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Bell className="inline h-4 w-4" aria-label="Notifications" />
                <span>{user?.unreadNotifications} unread</span>
                <span>·</span>
                <Globe className="inline h-4 w-4" aria-label="Language" />
                <button
                  onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                  className="hover:text-blue-600 transition-colors"
                >
                  {language === "en" ? "English" : "Swahili"}
                </button>
                <span>·</span>
                {/* {user?.cached || offline ? (
                  <span className="flex items-center text-green-600"><Wifi className="h-4 w-4 mr-1" aria-label="Offline status" />Offline Ready</span>
                ) : (
                  <span className="flex items-center text-gray-400"><WifiOff className="h-4 w-4 mr-1" aria-label="Online status" />Online Only</span>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-3 justify-center py-4 bg-white border-b px-4">
        <button
          onClick={() => setShowPostModal(true)}
          className={`${primaryBtnClasses} flex items-center gap-2`}
          aria-label="Create New Post"
        >
          <Plus /> New Post
        </button>
        <button
          onClick={() => setShowPrayerModal(true)}
          className={`${secondaryBtnClasses} flex items-center gap-2`}
          aria-label="Submit Prayer Request"
        >
          <Heart /> Prayer Request
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className={`${secondaryBtnClasses} flex items-center gap-2`}
          aria-label="Upload a File"
        >
          <FileUp /> Upload File
        </button>
      </section>

      {/* Modals */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleNewPost}
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md"
          >
            <h2 className="font-bold text-lg mb-4">Create New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
              rows={4}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
      {showPrayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handlePrayerRequest}
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md"
          >
            <h2 className="font-bold text-lg mb-4">New Prayer Request</h2>
            <textarea
              placeholder="Your prayer request"
              value={newPrayer.content}
              onChange={(e) =>
                setNewPrayer({ ...newPrayer, content: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
              rows={3}
              required
            />
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={newPrayer.anonymous}
                onChange={(e) =>
                  setNewPrayer({ ...newPrayer, anonymous: e.target.checked })
                }
                className="mr-2"
              />
              Post anonymously
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrayerModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleUploadFile}
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md"
          >
            <h2 className="font-bold text-lg mb-4">Upload File</h2>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="mb-3"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed and Sidebar (as before, but using fetched data) */}
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-4 gap-8" style={{ minHeight: '80vh' }}>
        {/* Feed */}
        <section className="flex-1 py-4 order-2 md:order-1">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="font-bold text-xl text-gray-800">Community Feed</h2>
            {/* ...filter buttons if needed... */}
          </div>
          <div className="space-y-4">
            {feed.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-400">No posts yet.</p>
                <p className="text-sm text-gray-400 mt-2">Be the first to share your thoughts with the community!</p>
              </div>
            )}
            {feed.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={`Thumbnail for ${post.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen
                      className="h-8 w-8 text-gray-400"
                      aria-label="Post icon"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-md text-gray-900 mb-1">
                    {post.title}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {post.verse}
                  </div>
                  <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {post.content}
                  </div>
                  {/* <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                    <span>By <span className="font-semibold text-gray-600">{post.author}</span></span>
                    {post.tags.map(tag => <span key={tag} className="text-blue-400">{tag}</span>)}
                  </div> */}
                  <div className="flex gap-4 border-t pt-2 mt-2">
                    <button
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label={`Like post, currently has ${
                        post.reactions?.heart || 0
                      } likes`}
                    >
                      <Heart className="h-4 w-4" />
                      {post.reactions?.heart || 0}
                    </button>
                    <button
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label={`View ${post.comments} comments`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </button>
                    <button
                      className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
                      aria-label={`Pray for post, ${
                        post.reactions?.pray || 0
                      } prayers`}
                    >
                      <Plus className="h-4 w-4 rotate-45" />
                      Pray {post.reactions?.pray || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scripture Quick Search (Integrated) */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-green-100">
          <div className="font-bold mb-3 text-gray-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" /> Scripture Search
          </div>

          <form onSubmit={handleScriptureSearch} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Gen 1:1 or Search topic..."
              value={scriptureSearchQuery}
              onChange={(e) => setScriptureSearchQuery(e.target.value)}
              className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search for Bible verse or topic"
            />
            <button
              type="submit"
              className={`${baseBtnClasses} px-3 py-2 bg-green-500 text-white hover:bg-green-600`}
              aria-label="Execute Search"
              disabled={isSearching || !scriptureSearchQuery.trim()}
            >
              {isSearching ? "..." : <Search className="h-5 w-5" />}
            </button>
          </form>

          <div className="text-xs text-gray-400 mt-2 min-h-[20px]">
            {/* Display Search Status/Results */}
            {isSearching && <span className="text-blue-500">Searching...</span>}

            {scriptureError && (
              <span className="text-red-500">{scriptureError}</span>
            )}

            {Array.isArray(scriptureResults) && scriptureResults.length > 0 && (
              <div className="mt-2 text-left">
                <span className="text-green-600 font-semibold">
                  Found {scriptureResults.length} result
                  {scriptureResults.length > 1 ? "s" : ""}.
                </span>

                {/* 🔥 Loop through the verses */}
                <div className="mt-2 space-y-3">
                  {scriptureResults.map((verse) => (
                    <div
                      key={verse.id}
                      className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="font-semibold text-gray-800">
                        {verse.reference}
                      </p>
                      <p className="text-gray-700">{verse.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scriptureResults?.length === 0 &&
              !isSearching &&
              !scriptureError && (
                <span className="text-gray-500">
                  No results found. Try a different query.
                </span>
              )}

            {!isSearching && !scriptureError && !scriptureResults && (
              <span>Search for a verse or topic.</span>
            )}
          </div>

          {/* Optional: Display detailed results below the search box */}
          {/*
    {scriptureResults?.length > 0 && (
        <div className="mt-4 border-t pt-3 space-y-2">
            {scriptureResults.slice(0, 3).map((result, index) => (
                <p key={index} className="text-sm text-gray-700">
                    <span className="font-bold text-blue-600">{result.reference}:</span> {result.text}
                </p>
            ))}
        </div>
    )}
    */}
        </div>
      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
