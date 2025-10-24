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
  Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Share Your Story",
      description: "Write and share your faith journey, reflections, and testimonies with a supportive community."
    },
    {
      icon: Heart,
      title: "Prayer Requests",
      description: "Submit prayer requests and pray for others in our community. Support each other through prayer."
    },
    {
      icon: BookOpen,
      title: "Scripture Search",
      description: "Search and discover Bible verses, connect scripture to your daily life and spiritual growth."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow believers, share encouragement, and build meaningful relationships."
    },
    {
      icon: Shield,
      title: "AI Moderation",
      description: "Advanced AI moderation ensures a safe, respectful environment for all community members."
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in English and Swahili, making it accessible to diverse Christian communities."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Love & Compassion",
      description: "We believe in the power of love and compassion to transform lives and communities."
    },
    {
      icon: Target,
      title: "Purpose & Mission",
      description: "Helping believers discover and live out their God-given purpose through community support."
    },
    {
      icon: Lightbulb,
      title: "Growth & Learning",
      description: "Continuous spiritual growth through shared experiences, wisdom, and biblical insights."
    },
    {
      icon: Award,
      title: "Excellence & Integrity",
      description: "Maintaining the highest standards of integrity, authenticity, and excellence in all we do."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Members" },
    { number: "50,000+", label: "Prayers Shared" },
    { number: "25,000+", label: "Posts Published" },
    { number: "100+", label: "Countries Reached" }
  ];

  const team = [
    {
      name: "Rev. Sarah Johnson",
      role: "Founder & Spiritual Director",
      description: "With over 20 years in ministry, Sarah founded Salt & Light to create a digital space for authentic Christian community.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Dr. Michael Chen",
      role: "Technology Director",
      description: "Leading our technical team with a passion for using technology to serve God's kingdom and connect believers worldwide.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Pastor Grace Mwangi",
      role: "Community Manager",
      description: "Grace ensures our community remains a safe, welcoming space for believers from all backgrounds and denominations.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
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
              About <span className="text-blue-600">Salt & Light</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              A digital sanctuary where believers connect, share their faith journey, 
              and support each other through prayer and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                disabled 
                className="btn-primary opacity-50 cursor-not-allowed"
                title="Registration coming soon"
              >
                Join Our Community
              </button>
              <Link to="/home" className="btn-outline">
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              "You are the salt of the earth... You are the light of the world." 
              - Matthew 5:13-14
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-6 leading-relaxed">
              We believe every Christian has a unique story to share and a light to shine. 
              Salt & Light provides a safe, supportive platform where believers can share 
              their faith journey, support each other through prayer, and grow together in Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the tools and features that make Salt & Light a unique 
              Christian community platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of believers who are already sharing their light and 
              making a difference in our community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="p-4 bg-yellow-100 rounded-xl">
                      <Icon className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate believers behind Salt & Light, dedicated to serving 
              God's kingdom through technology and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Community Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain a safe, respectful environment where all believers can 
              grow and share their faith journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">What We Encourage</h3>
              <div className="space-y-4">
                {[
                  "Sharing authentic faith experiences and testimonies",
                  "Supporting others through prayer and encouragement",
                  "Respectful dialogue and biblical discussion",
                  "Building meaningful Christian relationships",
                  "Sharing scripture and spiritual insights"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">What We Don't Allow</h3>
              <div className="space-y-4">
                {[
                  "Hate speech or discrimination of any kind",
                  "Spam, self-promotion, or commercial content",
                  "Inappropriate or offensive language",
                  "False teaching or unorthodox doctrine",
                  "Harassment or bullying of any kind"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="h-5 w-5 text-red-600 mt-1 flex-shrink-0 flex items-center justify-center">
                      <span className="text-sm font-bold">✕</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Share Your Light?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join our community of believers and start sharing your faith journey today. 
            Your story matters, and your light can inspire others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              disabled 
              className="btn-accent opacity-50 cursor-not-allowed"
              title="Registration coming soon"
            >
              Get Started Today
            </button>
            <Link to="/home" className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
