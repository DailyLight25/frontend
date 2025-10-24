import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  Heart, 
  MessageCircle, 
  Upload, 
  Settings, 
  Bell, 
  BarChart3, 
  BookOpen, 
  Shield, 
  TrendingUp,
  Calendar,
  Eye,
  ThumbsUp,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';

// Types
interface UserStats {
  totalPosts: number;
  totalPrayers: number;
  totalComments: number;
  totalViews: number;
  totalReactions: number;
  joinDate: string;
  lastActive: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  status: 'published' | 'pending' | 'flagged';
  views: number;
  created_at: string;
  updated_at: string;
  reactions: {
    heart: number;
    pray: number;
    comment: number;
  };
  comments_count: number;
  tags: string[];
  scripture_refs: string[];
  ai_moderation_feedback?: any;
}

interface PrayerRequest {
  id: number;
  content: string;
  prayer_count: number;
  is_anonymous: boolean;
  created_at: string;
  post?: number;
}

interface DashboardData {
  user: any;
  stats: UserStats;
  posts: Post[];
  prayerRequests: PrayerRequest[];
  recentActivity: any[];
}

const Dashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'prayers' | 'analytics' | 'settings'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Initialize with empty data structure
        const defaultStats: UserStats = {
          totalPosts: 0,
          totalPrayers: 0,
          totalComments: 0,
          totalViews: 0,
          totalReactions: 0,
          joinDate: authUser.date_joined || new Date().toISOString(),
          lastActive: authUser.last_login || new Date().toISOString()
        };

        let userProfile = authUser;
        let userPosts: Post[] = [];
        let userPrayers: PrayerRequest[] = [];

        try {
          // Fetch user profile
          userProfile = await apiService.get('users/me/');
        } catch (err) {
          console.warn('Could not fetch user profile, using auth user data:', err);
        }

        try {
          // Fetch user's posts
          const postsResponse = await apiService.get('posts/posts/');
          userPosts = postsResponse.filter((post: any) => post.author === authUser.id);
        } catch (err) {
          console.warn('Could not fetch posts:', err);
        }

        try {
          // Fetch user's prayer requests
          const prayersResponse = await apiService.get('prayer_requests/prayer_requests/');
          userPrayers = prayersResponse.filter((prayer: any) => prayer.author === authUser.id);
        } catch (err) {
          console.warn('Could not fetch prayer requests:', err);
        }
        
        // Calculate stats
        const stats: UserStats = {
          totalPosts: userPosts.length,
          totalPrayers: userPrayers.reduce((sum: number, prayer: any) => sum + prayer.prayer_count, 0),
          totalComments: userPosts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0),
          totalViews: userPosts.reduce((sum: number, post: any) => sum + (post.views || 0), 0),
          totalReactions: userPosts.reduce((sum: number, post: any) => 
            sum + (post.reactions?.heart || 0) + (post.reactions?.pray || 0) + (post.reactions?.comment || 0), 0),
          joinDate: authUser.date_joined || new Date().toISOString(),
          lastActive: authUser.last_login || new Date().toISOString()
        };

        setDashboardData({
          user: userProfile,
          stats,
          posts: userPosts,
          prayerRequests: userPrayers,
          recentActivity: [] // TODO: Implement activity feed
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'My Posts', icon: FileText },
    { id: 'prayers', label: 'Prayers', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!dashboardData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {authUser?.username}
                  </h1>
                  <p className="text-gray-600">
                    Manage your content and track your spiritual journey
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && <OverviewTab data={dashboardData} />}
              {activeTab === 'posts' && <PostsTab data={dashboardData} />}
              {activeTab === 'prayers' && <PrayersTab data={dashboardData} />}
              {activeTab === 'analytics' && <AnalyticsTab data={dashboardData} />}
              {activeTab === 'settings' && <SettingsTab data={dashboardData} />}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const { stats, posts, prayerRequests } = data;

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Prayers Received',
      value: stats.totalPrayers,
      icon: Heart,
      color: 'red',
      change: '+15%'
    },
    {
      title: 'Total Reactions',
      value: stats.totalReactions,
      icon: ThumbsUp,
      color: 'yellow',
      change: '+22%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()} • {post.views} views
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prayer Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prayer Requests</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {prayerRequests.slice(0, 3).map((prayer) => (
              <div key={prayer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2">{prayer.content}</p>
                  <p className="text-xs text-gray-500">
                    {prayer.prayer_count} prayers • {new Date(prayer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Posts Tab Component
const PostsTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const { posts } = data;

  return (
    <div className="space-y-6">
      {/* Posts Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
          <p className="text-gray-600">Manage and track your published content</p>
        </div>
        <button className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0">
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Start sharing your thoughts with the community</p>
            <button className="btn-primary">Create your first post</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.reactions.heart} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments_count} comments</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Prayers Tab Component
const PrayersTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const { prayerRequests } = data;

  return (
    <div className="space-y-6">
      {/* Prayers Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prayer Requests</h2>
          <p className="text-gray-600">Track your prayer requests and community support</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2 mt-4 sm:mt-0">
          <Plus className="h-4 w-4" />
          <span>New Prayer Request</span>
        </button>
      </div>

      {/* Prayers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {prayerRequests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prayer requests yet</h3>
            <p className="text-gray-600 mb-4">Share your prayer needs with the community</p>
            <button className="btn-secondary">Submit your first prayer request</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prayerRequests.map((prayer) => (
              <div key={prayer.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {prayer.is_anonymous ? 'Anonymous Prayer Request' : 'Prayer Request'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          <Heart className="h-3 w-3" />
                          <span className="text-xs font-medium">{prayer.prayer_count} prayers</span>
                        </div>
                        {prayer.is_anonymous && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{prayer.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
                      </div>
                      {prayer.post && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>Linked to post</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const { stats, posts } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600">Track your content performance and engagement</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Content Performance</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Views</span>
              <span className="font-semibold">{stats.totalViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Views per Post</span>
              <span className="font-semibold">
                {stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Engagement</h3>
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Reactions</span>
              <span className="font-semibold">{stats.totalReactions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comments</span>
              <span className="font-semibold">{stats.totalComments}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community Impact</h3>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Prayers Received</span>
              <span className="font-semibold">{stats.totalPrayers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="font-semibold">
                {new Date(stats.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {posts
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map((post, index) => (
              <div key={post.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {post.views} views • {post.reactions.heart} likes • {post.comments_count} comments
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={data.user.username || ''}
                className="input-field"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={data.user.email || ''}
                className="input-field"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="input-field">
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Public Profile</h4>
                <p className="text-xs text-gray-500">Allow others to see your profile</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-xs text-gray-500">Receive email updates</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Anonymous Posting</h4>
                <p className="text-xs text-gray-500">Allow anonymous prayer requests</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;