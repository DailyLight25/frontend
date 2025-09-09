import React from 'react';
import { Heart, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '/#about' },
      { name: 'Features', href: '/#features' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community', href: '/community' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Mail, href: '#', name: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <Heart className="h-8 w-8 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
              <div className="font-secondary font-bold text-xl">
                <span className="text-white">Daylight</span>
                <span className="text-yellow-500">25</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Empowering students and donors with transparency, faith, and trust. 
              Building bridges of hope and opportunity through community-driven support.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-500">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-500">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 Daylight25. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
              Built with Love & Light 
              <span className="ml-1 text-yellow-500">✨</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;