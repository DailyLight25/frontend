import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Shield, 
  Globe, 
  Lightbulb, 
  Target, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  MessageCircle,
  FileText,
  Calendar,
  Zap,
  Search,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  ThumbsUp,
  Download,
  Upload,
  Lock,
  Unlock,
  Smartphone,
  Laptop,
  Monitor,
  Wifi,
  WifiOff,
  Clock,
  MapPin,
  Languages,
  Plus,
  Sparkles,
  Tag
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeaturesPage: React.FC = () => {
  const coreFeatures = [
    {
      icon: FileText,
      title: "Share Your Story",
      description: "Write and share your faith journey, testimonies, and spiritual reflections with a supportive community.",
      benefits: [
        "Rich text editor with formatting options",
        "Scripture reference integration",
        "Tag and categorize your posts",
        "Draft and publish workflow"
      ],
      color: "blue"
    },
    {
      icon: Heart,
      title: "Prayer Requests",
      description: "Submit prayer requests and pray for others in our community. Support each other through prayer.",
      benefits: [
        "Anonymous prayer requests",
        "Prayer count tracking",
        "Community prayer support",
        "Prayer request notifications"
      ],
      color: "red"
    },
    {
      icon: BookOpen,
      title: "Scripture Search",
      description: "Search and discover Bible verses, connect scripture to your daily life and spiritual growth.",
      benefits: [
        "Advanced Bible search",
        "Multiple translations",
        "Verse bookmarking",
        "Scripture sharing"
      ],
      color: "green"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow believers, share encouragement, and build meaningful relationships.",
      benefits: [
        "User profiles and bios",
        "Follow other believers",
        "Comment and engage",
        "Community guidelines"
      ],
      color: "purple"
    },
    {
      icon: Shield,
      title: "AI Moderation",
      description: "Advanced AI moderation ensures a safe, respectful environment for all community members.",
      benefits: [
        "Content safety monitoring",
        "Automated moderation",
        "Community guidelines enforcement",
        "Safe environment maintenance"
      ],
      color: "yellow"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in English and Swahili, making it accessible to diverse Christian communities.",
      benefits: [
        "Language switching",
        "Localized content",
        "Cultural sensitivity",
        "Global accessibility"
      ],
      color: "indigo"
    }
  ];

  const platformFeatures = [
    {
      category: "Content Creation",
      features: [
        {
          icon: FileText,
          title: "Rich Text Editor",
          description: "Create beautiful posts with formatting, links, and media"
        },
        {
          icon: Upload,
          title: "File Uploads",
          description: "Share images, documents, and other files with your posts"
        },
        {
          icon: Tag,
          title: "Tagging System",
          description: "Organize content with custom tags and categories"
        },
        {
          icon: Calendar,
          title: "Scheduling",
          description: "Schedule posts for optimal engagement times"
        }
      ]
    },
    {
      category: "Community Engagement",
      features: [
        {
          icon: MessageCircle,
          title: "Comments & Discussions",
          description: "Engage in meaningful conversations"
        },
        {
          icon: ThumbsUp,
          title: "Reactions & Likes",
          description: "Show appreciation with hearts, prayers, and likes"
        },
        {
          icon: Bell,
          title: "Notifications",
          description: "Stay updated with real-time notifications"
        },
        {
          icon: Users,
          title: "User Profiles",
          description: "Create detailed profiles to connect with others"
        }
      ]
    },
    {
      category: "Spiritual Tools",
      features: [
        {
          icon: BookOpen,
          title: "Bible Integration",
          description: "Search and reference Bible verses in your posts"
        },
        {
          icon: Heart,
          title: "Prayer Wall",
          description: "Submit and respond to prayer requests"
        },
        {
          icon: Star,
          title: "Devotional Content",
          description: "Access daily devotionals and spiritual content"
        },
        {
          icon: Sparkles,
          title: "Peace & Meditation",
          description: "Guided meditation and peace-focused content"
        }
      ]
    },
    {
      category: "Analytics & Insights",
      features: [
        {
          icon: BarChart3,
          title: "Content Analytics",
          description: "Track your content performance and engagement"
        },
        {
          icon: TrendingUp,
          title: "Growth Metrics",
          description: "Monitor your spiritual and community growth"
        },
        {
          icon: Eye,
          title: "View Tracking",
          description: "See how your content impacts others"
        },
        {
          icon: Award,
          title: "Achievements",
          description: "Earn badges for community participation"
        }
      ]
    }
  ];

  const deviceSupport = [
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Native iOS and Android apps for on-the-go access",
      features: ["Push notifications", "Offline reading", "Mobile-optimized interface"]
    },
    {
      icon: Laptop,
      title: "Web Platform",
      description: "Full-featured web application accessible from any browser",
      features: ["Responsive design", "Cross-browser compatibility", "Progressive Web App"]
    },
    {
      icon: Monitor,
      title: "Desktop App",
      description: "Dedicated desktop applications for Windows, Mac, and Linux",
      features: ["Native performance", "System integration", "Offline capabilities"]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "End-to-end encryption and secure data storage"
    },
    {
      icon: Lock,
      title: "Privacy Controls",
      description: "Granular privacy settings and content visibility controls"
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: "Enhanced security with 2FA and biometric login"
    },
    {
      icon: Globe,
      title: "GDPR Compliance",
      description: "Full compliance with international data protection regulations"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-blue-600">Features</span> for Your
              <br />
              <span className="text-yellow-500">Spiritual Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Discover the comprehensive tools and features designed to enhance 
              your faith journey and connect you with a global Christian community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                disabled 
                className="btn-primary opacity-50 cursor-not-allowed"
                title="Registration coming soon"
              >
                Get Started
              </button>
              <Link to="/about" className="btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential tools that make Salt & Light the perfect platform for 
              sharing your faith and connecting with believers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className={`p-4 bg-${feature.color}-100 rounded-xl mr-4`}>
                      <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features by Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, share, and grow in your faith journey.
            </p>
          </div>
          
          <div className="space-y-16">
            {platformFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.features.map((feature, featureIndex) => {
                    const Icon = feature.icon;
                    return (
                      <div key={featureIndex} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Access Anywhere, Anytime
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Salt & Light is available across all your devices with seamless 
              synchronization and optimized experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deviceSupport.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                    <Icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{device.title}</h3>
                  <p className="text-gray-600 mb-6">{device.description}</p>
                  <ul className="space-y-2 text-left">
                    {device.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Security & Privacy First
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy and security are our top priorities. We use industry-leading 
              security measures to protect your data and ensure a safe environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Salt & Light?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Salt & Light compares to other platforms and why it's 
              the perfect choice for your spiritual journey.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Moderation</h3>
                <p className="text-gray-600">
                  Advanced AI ensures a safe, respectful environment for all users, 
                  automatically moderating content while maintaining community spirit.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Community</h3>
                <p className="text-gray-600">
                  Connect with believers from around the world, sharing diverse 
                  perspectives and experiences in a unified Christian community.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scripture Integration</h3>
                <p className="text-gray-600">
                  Deep Bible integration with search, reference, and sharing capabilities 
                  that help you connect scripture to your daily life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of believers who are already using Salt & Light to 
            share their faith, connect with others, and grow spiritually.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              disabled 
              className="btn-accent opacity-50 cursor-not-allowed"
              title="Registration coming soon"
            >
              Start Your Journey
            </button>
            <Link to="/about" className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
