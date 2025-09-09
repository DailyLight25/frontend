import React from 'react';
import { ArrowRight, Shield, Users, Sparkles, Heart, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every donation tracked with complete visibility and accountability. Build trust through radical transparency.',
      gradient: 'from-blue-800 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Faith & Trust',
      description: 'Rooted in Christian values, fostering genuine connections between donors and students.',
      gradient: 'from-yellow-500 to-yellow-400',
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Creating lasting change through community-driven support and shared purpose.',
      gradient: 'from-green-600 to-green-500',
    },
  ];

  const stats = [
    { number: '1,000+', label: 'Students Supported' },
    { number: '$250K+', label: 'Funds Raised' },
    { number: '500+', label: 'Active Donors' },
    { number: '98%', label: 'Transparency Rate' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center light-rays hero-gradient overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="font-secondary font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
              Be the <span className="text-yellow-300">Salt</span> and{' '}
              <span className="text-yellow-300">Light</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering students and donors with transparency, faith, and trust. 
              Building bridges of hope through community-driven support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth/register" className="btn-accent text-lg px-8 py-4">
                Get Started
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
              <Link to="/auth/login" className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-800">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-yellow-300 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-white rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="font-secondary font-bold text-4xl md:text-5xl text-blue-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="font-secondary font-bold text-4xl md:text-5xl text-gray-900 mb-6">
              Why Choose <span className="text-blue-800">Daylight25</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built on the foundation of Christian values, we create meaningful connections 
              between generous hearts and aspiring students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 mx-auto`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-secondary font-bold text-2xl text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="slide-up">
              <h2 className="font-secondary font-bold text-4xl md:text-5xl text-gray-900 mb-6">
                Our <span className="text-yellow-500">Mission</span>
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                At Daylight25, we believe in the power of community and faith to transform lives. 
                Our platform connects generous donors with deserving students, creating pathways 
                to educational success.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">100% Transparent Transactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">Faith-Based Community</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Star className="h-4 w-4 text-gray-900" />
                  </div>
                  <span className="text-gray-700">Direct Student Support</span>
                </div>
              </div>
            </div>
            <div className="relative slide-up">
              <div className="glass-card p-8 text-center">
                <TrendingUp className="h-16 w-16 text-blue-800 mx-auto mb-6" />
                <h3 className="font-secondary font-bold text-2xl text-gray-900 mb-4">
                  Growing Impact
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Every month, we're expanding our reach and helping more students 
                  achieve their educational dreams through generous community support.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-bold text-2xl text-blue-800">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-green-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-6">
              Ready to Make a <span className="text-yellow-400">Difference</span>?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of donors and students who are already part of the Daylight25 community. 
              Your generosity can change lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth/register" className="btn-accent text-lg px-8 py-4">
                Start Your Journey
              </Link>
              <Link to="/auth/login" className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-800">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;