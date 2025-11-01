import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Camera, Edit3, Heart, MessageCircle, Plus, BarChart3, ArrowLeft, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  profile_picture?: string;
  cover_photo?: string;
  date_joined: string;
  is_verified: boolean;
  follower_count?: number;
  following_count?: number;
}

interface ApiPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  reaction_counts?: Record<string, number> | null;
  comment_count?: number | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  heartReactions: number;
  prayReactions: number;
  comments: number;
  imageUrl?: string;
}

const ProfilePage: React.FC = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    first_name: '',
    last_name: ''
  });

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await apiService.getCurrentUser<User>();
      setUser({
        ...userData,
        follower_count: userData.follower_count ?? 0,
        following_count: userData.following_count ?? 0,
      });
      setEditData({
        bio: userData.bio || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      });
      setError(null);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Unable to load your profile details right now. Please try again.');
      throw error;
    }
  }, []);

  const fetchUserPosts = useCallback(async () => {
    if (!isAuthenticated) {
      setPosts([]);
      return [] as Post[];
    }

    try {
      const postsResponse = await apiService.get<ApiPost[]>("posts/posts/?author=me");
      const normalizedPosts = Array.isArray(postsResponse)
        ? postsResponse.map((post) => {
            const reactionCounts = post.reaction_counts ?? {};
            const heartRaw = Number((reactionCounts && reactionCounts.heart) ?? (reactionCounts && reactionCounts.love) ?? 0);
            const prayRaw = Number((reactionCounts && reactionCounts.pray) ?? (reactionCounts && reactionCounts.amen) ?? 0);
            const commentsRaw = Number(post.comment_count ?? 0);

            return {
              id: post.id,
              title: post.title,
              content: post.content ?? '',
              created_at: post.created_at,
              heartReactions: Number.isNaN(heartRaw) ? 0 : heartRaw,
              prayReactions: Number.isNaN(prayRaw) ? 0 : prayRaw,
              comments: Number.isNaN(commentsRaw) ? 0 : commentsRaw,
              imageUrl: post.image_url ?? undefined,
            } as Post;
          })
        : [];
      setPosts(normalizedPosts);
      return normalizedPosts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Unable to load your recent posts. Please refresh the page.');
      throw error;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setUser(null);
      setPosts([]);
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUserData(), fetchUserPosts()]);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [authLoading, isAuthenticated, authUser?.id, fetchUserData, fetchUserPosts]);

  useEffect(() => {
    if (authUser) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              follower_count: authUser.follower_count ?? prev.follower_count,
              following_count: authUser.following_count ?? prev.following_count,
            }
          : prev
      );
    }
  }, [authUser?.follower_count, authUser?.following_count]);

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await apiService.patchCurrentUser(editData);
      setUser((prev) => {
        const base = prev ?? ({} as User);
        return {
          ...base,
          ...updatedUser,
          follower_count: updatedUser.follower_count ?? base.follower_count ?? 0,
          following_count: updatedUser.following_count ?? base.following_count ?? 0,
        };
      });
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'We could not update your profile right now. Please try again.';
      setError(message);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }

    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalEngagements = useMemo(
    () =>
      posts.reduce(
        (total, post) => total + post.heartReactions + post.prayReactions + post.comments,
        0
      ),
    [posts]
  );

  const topPosts = useMemo(
    () =>
      posts
        .slice()
        .sort(
          (a, b) =>
            b.heartReactions + b.prayReactions + b.comments -
            (a.heartReactions + a.prayReactions + a.comments)
        )
        .slice(0, 3),
    [posts]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-5 rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
            <UserIcon />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Sign in to view your profile</h2>
            <p className="text-sm text-gray-600">
              Log in to manage your profile, share testimonies, and connect with the community.
            </p>
          </div>
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 flex items-center space-x-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </motion.button>

      {/* Profile Header */}
      <div className="relative">
        <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden rounded-b-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          {user?.cover_photo ? (
            <img
              src={user.cover_photo}
              alt="Cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/25" />
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 flex justify-center sm:justify-start">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36">
              <img
                src={
                  user?.avatar ||
                  user?.profile_picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=random&color=fff&size=180`
                }
                alt={user?.username || 'Profile avatar'}
                className="h-full w-full rounded-full border-4 border-white shadow-2xl object-cover bg-white"
              />
              <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}
                </h1>
                {user?.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">@{user?.username ?? '—'}</p>
              <p className="text-sm text-gray-500">Joined {formatDate(user?.date_joined) || '—'}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-gray-900">{user?.follower_count ?? 0}</span>
                <span className="text-gray-500">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-gray-900">{user?.following_count ?? 0}</span>
                <span className="text-gray-500">Following</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 shadow-sm"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      value={editData.first_name}
                      onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      value={editData.last_name}
                      onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                    rows={4}
                    maxLength={320}
                  />
                  <span className="text-xs text-gray-400 text-right">{editData.bio.length}/320</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {user?.bio || "No bio available. Click 'Edit Profile' to add one."}
              </p>
            )}
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-white to-blue-50 p-5 text-center shadow-sm">
              <div className="text-sm font-medium text-blue-600">Published Posts</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{posts.length}</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-white to-rose-50 p-5 text-center shadow-sm">
              <div className="text-sm font-medium text-rose-600">Followers</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{user?.follower_count ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-white to-emerald-50 p-5 text-center shadow-sm">
              <div className="text-sm font-medium text-emerald-600">Following</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{user?.following_count ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-white to-purple-50 p-5 text-center shadow-sm">
              <div className="text-sm font-medium text-purple-600">Total Engagements</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{totalEngagements}</div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h2>
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    >
                      {post.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-lg aspect-video">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{post.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.content}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-rose-500" />
                            <span>{post.heartReactions}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{post.comments}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4 text-emerald-500" />
                            <span>{post.prayReactions}</span>
                          </span>
                        </div>
                        <span className="font-medium text-gray-600">
                          {formatDate(post.created_at) || '—'}
                        </span>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Share your first story</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Inspire the community by posting a prayer, testimony, or encouragement.
                    </p>
                    <button
                      onClick={() => navigate('/home')}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      Share A Story
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Posts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Posts</h2>
              <div className="space-y-4">
                {topPosts.length ? (
                  topPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-4 bg-white/90 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        <span className="text-xs font-medium text-gray-500">{formatDate(post.created_at) || '—'}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-base mb-2">{post.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-rose-500" />
                          <span>{post.heartReactions}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-blue-500" />
                          <span>{post.comments}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 text-emerald-500" />
                          <span>{post.prayReactions}</span>
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Engage with the community to see your top-performing posts here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Edit Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        onClick={() => setIsEditing(!isEditing)}
      >
        <Edit3 className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default ProfilePage;
