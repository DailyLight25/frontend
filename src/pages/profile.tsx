import React, { useState, useEffect } from 'react';
import { Camera, Edit3, Heart, MessageCircle, Share2, MoreHorizontal, Plus, BarChart3, ArrowLeft } from 'lucide-react';
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
  cover_photo?: string;
  date_joined: string;
  is_verified: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  reactions: {
    heart: number;
    pray: number;
  };
  comments: number;
  thumbnail?: string;
}

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      setEditData({
        bio: userData.bio || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      // This would be a real API call to get user's posts
      // For now, using mock data
      const mockPosts: Post[] = [
        {
          id: 1,
          title: "Walking in Faith",
          content: "Today I was reminded that God's timing is perfect. Even when we don't understand, we can trust in His plan.",
          author: user?.username || 'user',
          created_at: '2024-01-15T10:30:00Z',
          reactions: { heart: 12, pray: 8 },
          comments: 5
        },
        {
          id: 2,
          title: "Community Prayer",
          content: "Let's come together in prayer for our community. There's power in unity and faith.",
          author: user?.username || 'user',
          created_at: '2024-01-14T15:45:00Z',
          reactions: { heart: 24, pray: 18 },
          comments: 12
        },
        {
          id: 3,
          title: "Scripture Reflection",
          content: "John 3:16 - The greatest love story ever told. How has this verse impacted your life?",
          author: user?.username || 'user',
          created_at: '2024-01-13T09:20:00Z',
          reactions: { heart: 8, pray: 15 },
          comments: 7
        }
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await apiService.patchCurrentUser(editData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTopPosts = () => {
    return posts
      .sort((a, b) => (b.reactions.heart + b.reactions.pray) - (a.reactions.heart + a.reactions.pray))
      .slice(0, 3);
  };

  const totalEngagements = posts.reduce((total, post) => 
    total + post.reactions.heart + post.reactions.pray + post.comments, 0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <button className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="relative -mt-16 px-6">
          <div className="relative inline-block">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random&color=fff&size=128`}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6 pt-4">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username}
                {user?.is_verified && (
                  <span className="ml-2 text-blue-600">
                    <svg className="h-5 w-5 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </h1>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="text-sm text-gray-500">Joined {formatDate(user?.date_joined || '')}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {user?.bio || "No bio available. Click 'Edit Profile' to add one."}
              </p>
            )}
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{totalEngagements}</div>
              <div className="text-sm text-gray-600">Total Engagements</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {posts.length > 0 ? Math.round(totalEngagements / posts.length) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg. Engagement</div>
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-3">
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
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.reactions.heart}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{post.reactions.pray}</span>
                        </span>
                      </div>
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Posts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Posts</h2>
              <div className="space-y-4">
                {getTopPosts().map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{post.title}</h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.reactions.heart}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{post.reactions.pray}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
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
